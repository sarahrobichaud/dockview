import fs from "fs";
import path from "path";
import { inject, injectable } from "tsyringe";
import { fileURLToPath } from "url";
import type { VaultWriterContract } from "~/lib/vault-writer/VaultWriterContract";
import { DockviewDockerContainer, DockviewInstance, DockviewServerInstance, InstanceSetupEvent } from "~/models/Instance";
import { DockerServiceContract } from "~/services/interfaces/DockerServiceContract";
import { TOKENS } from "~/tokens";
import { RequirementList } from "./SetupService";
import { DockviewError } from "~/errors/DockviewError";
import { DockerfileGenerator } from "~/lib/dockerfile-util/DockerfileGenerator";
import tar from "tar-fs";
import Docker , {Container, ImageBuildContext} from "dockerode";
const __dirname = fileURLToPath(import.meta.url);

const docker = new Docker();

@injectable()
export class DockerService implements DockerServiceContract {

    private readonly nginxConfigFileName = "dockview.nginx.conf";
    private readonly dockerfileName = "Dockerfile.dockview.yaml";
    private readonly _dockerfileGenerator: DockerfileGenerator;

    private readonly networkName = "dockview_internal";

    constructor(
        @inject(TOKENS.VaultWriter) private _writer: VaultWriterContract
    ) {
        this._dockerfileGenerator = new DockerfileGenerator();
    }

    async startContainer(instance: DockviewServerInstance): Promise<void> {

        if(!instance.project.analysis.dockerfileExists){
            instance.logs.logError("Dockerfile does not exist");
            return;
        }

        const containerName = `${instance.project.name}-${instance.id}`;

        try {

            const imageName = await this.buildImage(instance, `${instance.project.name}-${instance.project.version}:dockview`);
            await this.createNetwork(instance);

            instance.logs.logInfo("Spinning up container", containerName);

            const container = await docker.createContainer({
                Image: imageName,
                name: containerName,
                HostConfig: {
                    NetworkMode: this.networkName,
                }
            })

            await container.start();

            instance.logs.logInfo("Container spun up", containerName);

            instance.attach(new DockviewDockerContainer(container));

            instance.logs.logInfo("Container attached", containerName);

            instance.logs.logInfo("Container spun up", containerName);

            return;

        }catch(err){
            console.log(err);
            instance.logs.logError("Error spinning up container");
        }
    }

    stopContainer(instance: DockviewServerInstance): Promise<void> {
        throw new Error("Method not implemented.");
    }

    createDockerFile(instance: DockviewInstance, requirements: RequirementList): void {
        this.copyNginxConfig(instance);
        const dockerfileContents = this._dockerfileGenerator.generateDockerfile(instance, requirements);
        this._writer.writeFileToProjectVersion(instance.project, this.dockerfileName, dockerfileContents);
    }

    // Ok here for now but it's not super related to docker
    private copyNginxConfig(instance: DockviewInstance): boolean {

        const nginxConfigPath = path.join(__dirname, '../../../', 'containers', 'docker', 'config', 'default.nginx.conf');

        if(!fs.existsSync(nginxConfigPath)) {
            instance.logs.logWarning("Nginx config file not found", nginxConfigPath);
            return false;
        }

        try{

            const nginxConfig = fs.readFileSync(nginxConfigPath, 'utf8');
            this._writer.writeFileToProjectVersion(instance.project, this.nginxConfigFileName, nginxConfig);
            return true;

        } catch(e) {

            if(e instanceof Error) {
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

        if(existingNetwork){
            instance.logs.logInfo("Network already exists, Skipping creation", this.networkName);
            return;
        }

        try{
            await docker.createNetwork({
                Name: this.networkName,
                Driver: "bridge",
            });
            instance.logs.logInfo("Network created", this.networkName);
        }catch(err){
            instance.logs.logError("Failed to create network");
        }

    }


    private async buildImage(instance: DockviewInstance, imageName: string): Promise<string> {
        const {sourceDirectory} = instance.project.analysis;
        const dockerfile = this.dockerfileName;

        return new Promise(async (resolve, reject) => {
            try {
                const tarStream = tar.pack(sourceDirectory);

                const options = {
                    t: imageName,
                    dockerfile: dockerfile,
                }

                //@ts-ignore
                docker.buildImage(tarStream, options, (err, stream) => {
                    if(err || !stream) {
                        reject(err);
                        return;
                    }

                    stream.on("data", (data: any) => {
                        console.log(data.toString());
                    });

                    stream.on("end", () => {
                        resolve(imageName);
                    });

                    stream.on("error", (err: any) => {
                        reject(err);
                    });
                });
            } catch(e) {
                reject(e);
            }
        });
        
    }
}