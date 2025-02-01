import { DockviewInstance } from "~/models/Instance";
import { RequirementList } from "~/services/infrastructure/SetupService";
import { DockerfileGeneratorContract } from "./DockerfileGeneratorContract";

export class DockerfileGenerator implements DockerfileGeneratorContract {

    private readonly _NGINX_IMAGE = "nginx:latest";
    private readonly _NODE_IMAGE = "node:20-alpine";

    generateDockerfile(instance: DockviewInstance, requirements: RequirementList): Promise<string> {
        let content = "";

        let done = false;

        // Initial steps
        let builderSteps = [
            this.getImage.bind(this, instance, "builder"),
                () => `WORKDIR /app`,
                () => `COPY . .`,
        ]

        // Building the project
        if(requirements.buildProject) {
            builderSteps.push(
                this.getBasePackages.bind(this, instance),
                () => `RUN npm ci`,
                () => `RUN ${instance.project.analysis.commands.build}`
            )
        }

        if(instance.project.analysis.environment === "static-server") {
            builderSteps.push(
                () => `COPY default.nginx.conf /etc/nginx/conf.d/default.conf`
            )
        }

        const finalSteps = [
            this.getImage.bind(this, instance, "final"),
            this.getFinalWorkingDirectory.bind(this, instance),
        ];

        this.setContent(content, instance, [
            ...builderSteps,
            ...finalSteps
        ]);

        return Promise.resolve(content);
    }

    private setContent(content: string, instance: DockviewInstance, steps: (() => string)[]): string {
        for(const step of steps) {
            if(instance.shouldAbort) break;
            content += step() + "\n";
        }
        return content;
    }

    private getImage (instance: DockviewInstance, stage?: string): string {

        let image = "";
        switch(instance.project.analysis.environment) {
            case "node-server":
                image = this._NODE_IMAGE;
                break;
            case "static-server":
                image = this._NGINX_IMAGE;
                break;
            default:
                instance.logs.logError("Unsupported environment", instance.project.analysis.environment);
                break;
        }


        if(stage) {
            return `FROM ${image} AS ${stage}\n`;
        }

        return `FROM ${image}\n`;
    }

    private getBasePackages(instance: DockviewInstance): string {
        return `RUN apk update && apk add vim\n`;
    }

    private setWorkingDirectory(instance: DockviewInstance): string {
        return `WORKDIR /app\n`;
    }

    private copyPackageJson(instance: DockviewInstance): string {
        return `COPY package*.json ./\n`;
    }

    private getFinalWorkingDirectory(instance: DockviewInstance): string {
        switch(instance.project.analysis.environment) {
            case "node-server":
                return `WORKDIR /app\n`;
            case "static-server":
                return `WORKDIR /usr/share/nginx/html\n`;
            default:
                instance.logs.logError("Unsupported environment", instance.project.analysis.environment);
                return "";
        }
    }
}