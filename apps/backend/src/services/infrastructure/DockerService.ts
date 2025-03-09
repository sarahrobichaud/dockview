import { ContainerStatus } from "@dockview/core/enums";
import { DockviewDockerContainer, DockviewInstance, DockviewServerInstance } from "@dockview/core/models";
import Docker from "dockerode";
import fs from "fs";
import path from "path";
import tar from "tar-fs";
import { fileURLToPath } from "url";
import { DockerfileGenerator } from "~/lib/dockerfile-util/DockerfileGenerator";
import type { VaultWriterContract } from "~/lib/vault-writer/VaultWriterContract";
import { DockerServiceContract } from "~/services/interfaces/DockerServiceContract";
import { RequirementList } from "./SetupService";
const __dirname = fileURLToPath(import.meta.url);

const docker = new Docker();

export class DockerService implements DockerServiceContract {

    private readonly nginxConfigFileName = "dockview.nginx.conf";
    private readonly dockerfileName = "Dockerfile.dockview.yaml";
    private readonly _dockerfileGenerator: DockerfileGenerator;

    private readonly networkName = "dockview_internal";

    constructor(
        private _writer: VaultWriterContract
    ) {
        this._dockerfileGenerator = new DockerfileGenerator();
    }

    async startContainer(instance: DockviewServerInstance): Promise<void> {

        if (!instance.project.analysis.dockerfileExists) {
            instance.logs.logError("Dockerfile does not exist");
            return;
        }

        const containerName = `${instance.project.name}-${instance.id}`;

        try {

            const imageName = await this.buildImage(instance, `${instance.project.name}-${instance.project.version}:dockview`);

            await new Promise(resolve => setTimeout(resolve, 1000));

            await this.createNetwork(instance);

            await new Promise(resolve => setTimeout(resolve, 1000));

            instance.logs.logInfo("Spinning up container", containerName);

            instance.status = ContainerStatus.SPIN_UP;

            await new Promise(resolve => setTimeout(resolve, 1000));

            const container = await docker.createContainer({
                Image: imageName,
                name: containerName,
                HostConfig: {
                    NetworkMode: this.networkName,
                }
            })

            await container.start();

            instance.status = ContainerStatus.STARTED;
            instance.logs.logInfo("Container starting", containerName);

            await new Promise(resolve => setTimeout(resolve, 1000));


            instance.attach(new DockviewDockerContainer(container));

            await new Promise(resolve => setTimeout(resolve, 1000));

            instance.logs.logInfo("Container is ready", containerName);

            return;

        } catch (err) {
            console.log(err);
            instance.logs.logError("Error spinning up container");
        }
    }

    stopContainer(instance: DockviewServerInstance): Promise<void> {
        throw new Error("Method not implemented.");
    }

    createDockerFile(instance: DockviewInstance, requirements: RequirementList): void {
        instance.status = ContainerStatus.CREATING_DOCKERFILE;

        this.copyNginxConfig(instance);

        const dockerfileContents = this._dockerfileGenerator.generateDockerfile(instance, requirements);
        this._writer.writeFileToProjectVersion(instance.project, this.dockerfileName, dockerfileContents);
        instance.project.analysis.dockerfileExists = true;
    }

    // Ok here for now but it's not super related to docker
    private copyNginxConfig(instance: DockviewInstance): boolean {

        instance.status = ContainerStatus.CREATING_DOCKERFILE;

        const nginxConfigPath = path.join(__dirname, '../../../', 'containers', 'docker', 'config', 'default.nginx.conf');

        if (!fs.existsSync(nginxConfigPath)) {
            instance.logs.logWarning("Nginx config file not found", nginxConfigPath);
            return false;
        }

        try {

            const nginxConfig = fs.readFileSync(nginxConfigPath, 'utf8');
            this._writer.writeFileToProjectVersion(instance.project, this.nginxConfigFileName, nginxConfig);
            return true;

        } catch (e) {

            if (e instanceof Error) {
                instance.logs.logError("Failed to write nginx config to project version", e.message);
            } else {
                instance.logs.logError("Failed to write nginx config to project version");
            }
            return false;
        }
    }

    private async createNetwork(instance: DockviewInstance): Promise<void> {
        const networks = await docker.listNetworks();
        const existingNetwork = networks.find((network: any) => network.Name === this.networkName);

        if (existingNetwork) {
            instance.logs.logInfo("Network already exists, Skipping creation", this.networkName);
            return;
        }

        try {
            await docker.createNetwork({
                Name: this.networkName,
                Driver: "bridge",
            });
            instance.logs.logInfo("Network created", this.networkName);
        } catch (err) {
            instance.logs.logError("Failed to create network");
        }

    }


    private async buildImage(instance: DockviewInstance, imageName: string): Promise<string> {
        const { sourceDirectory } = instance.project.analysis;
        const dockerfile = this.dockerfileName;

        instance.status = ContainerStatus.BUILDING_IMAGE;
        instance.logs.logInfo("Building Docker image", imageName);

        await new Promise(resolve => setTimeout(resolve, 1000));

        return new Promise(async (resolve, reject) => {
            try {
                const tarStream = tar.pack(sourceDirectory);

                const options = {
                    t: imageName,
                    dockerfile: dockerfile,
                }

                //@ts-ignore
                docker.buildImage(tarStream, options, (err, stream) => {
                    if (err || !stream) {
                        instance.logs.logError("Failed to start Docker build", err?.message);
                        reject(err);
                        return;
                    }

                    let currentStep = "";

                    stream.on("data", async (data: any) => {
                        try {
                            const output = data.toString();

                            // Split by newlines to handle multiple JSON objects in a single chunk
                            const lines = output.split(/\r?\n/).filter((line: string) => line.trim() !== '');

                            for (const line of lines) {
                                try {
                                    const parsedData = JSON.parse(line);

                                    // Handle stream output (build steps)
                                    if (parsedData.stream) {
                                        const streamContent = parsedData.stream.trim();

                                        // Log build steps
                                        if (streamContent.startsWith("Step ")) {
                                            currentStep = streamContent;
                                            if (currentStep.includes("ENV")) {
                                                instance.status = ContainerStatus.SETTING_UP_ENV_SECRETS;
                                                await new Promise(resolve => setTimeout(resolve, 500));
                                                instance.logs.logInfo(`Build: [hidden]`);
                                            } else if (currentStep.includes(instance.project.analysis.packageManager)) {
                                                instance.status = ContainerStatus.INSTALLING_DEPENDENCIES;
                                                instance.logs.logInfo(`Build: [hidden]`);
                                            } else {
                                                instance.logs.logInfo(`Build: ${streamContent}`);
                                            }
                                        }
                                        // Log successful build
                                        else if (streamContent.startsWith("Successfully built")) {
                                            instance.logs.logInfo("Image built successfully", streamContent);
                                        }
                                        // Log successful tagging
                                        else if (streamContent.startsWith("Successfully tagged")) {
                                            instance.logs.logInfo("Image tagged", streamContent);
                                        }
                                        // Log other meaningful output (not empty lines or just arrows)
                                        else if (streamContent && !streamContent.match(/^\s*-+>/) && !streamContent.match(/^\s*$/)) {
                                            instance.logs.logInfo(`Build: ${streamContent}`);
                                        }
                                    }
                                    // Handle error messages
                                    else if (parsedData.error) {
                                        console.log({ error: parsedData.error });
                                        instance.logs.logError("Docker build error", parsedData.error);
                                    }
                                    // Handle auxiliary information
                                    else if (parsedData.aux) {
                                        // We can ignore aux messages as they're mostly internal IDs
                                    }
                                    // Handle any other JSON format we didn't anticipate
                                    else {
                                        const content = JSON.stringify(parsedData);
                                        if (content !== '{}') {
                                            instance.logs.logInfo(`Build: ${content}`);
                                        }
                                    }
                                } catch (jsonError) {
                                    // If a single line isn't valid JSON, log it as raw output
                                    if (line.trim()) {
                                        instance.logs.logInfo(`Build: ${line.trim()}`);
                                    }
                                }
                            }
                        } catch (parseError) {
                            // If we can't process the output at all, log it as a warning
                            instance.logs.logWarning("Failed to process Docker output", data.toString());
                        }
                    });

                    stream.on("end", () => {
                        instance.logs.logInfo("Docker build completed", imageName);
                        resolve(imageName);
                    });

                    stream.on("error", (err: any) => {
                        instance.logs.logError("Docker build failed", err?.message || "Unknown error");
                        reject(err);
                    });
                });
            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : "Unknown error";
                instance.logs.logError("Failed to build Docker image", errorMessage);
                reject(e);
            }
        });
    }
}