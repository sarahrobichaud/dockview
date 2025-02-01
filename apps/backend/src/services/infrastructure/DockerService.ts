import fs from "fs";
import path from "path";
import { inject, injectable } from "tsyringe";
import { fileURLToPath } from "url";
import type { VaultWriterContract } from "~/lib/vault-writer/VaultWriterContract";
import { DockviewInstance, InstanceSetupEvent } from "~/models/Instance";
import { DockerServiceContract } from "~/services/interfaces/DockerServiceContract";
import { TOKENS } from "~/tokens";
import { RequirementList } from "./SetupService";
import { DockviewError } from "~/errors/DockviewError";

const __dirname = fileURLToPath(import.meta.url);

@injectable()
export class DockerService implements DockerServiceContract {

    private readonly nginxConfigFileName = "dockview.nginx.conf";

    constructor(
        @inject(TOKENS.VaultWriter) private _writer: VaultWriterContract
    ) {}

    startContainer(containerName: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    stopContainer(containerName: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    createDockerFile(instance: DockviewInstance, requirements: RequirementList): Promise<void> {
        const content = 
        this.copyNginxConfig(instance);


        return Promise.resolve();
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
}