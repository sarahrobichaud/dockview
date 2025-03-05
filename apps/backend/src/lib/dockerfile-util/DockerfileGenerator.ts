import { DockviewInstance } from "@dockview/core/models";
import { RequirementList } from "~/services/infrastructure/SetupService";
import { DockerfileGeneratorContract } from "./DockerfileGeneratorContract";

export class DockerfileGenerator implements DockerfileGeneratorContract {

    private readonly _NGINX_IMAGE = "nginx:latest";
    private readonly _NODE_IMAGE = "node:20-alpine";

    generateDockerfile(instance: DockviewInstance, requirements: RequirementList): string {

        // Initial steps
        let builderSteps = [
            this.getImage.bind(this, instance, "builder"),
            () => `WORKDIR /app`,
            () => `COPY . .`,
        ]

        // Building the project
        if (requirements.buildProject) {
            builderSteps.push(
                () => `RUN npm ci`,
                () => `RUN ${instance.project.analysis.commands.build.join(" ")}`
            )
        }


        const finalSteps = [
            this.getImage.bind(this, instance, "final"),
            this.getFinalWorkingDirectory.bind(this, instance),
        ];

        if (instance.project.analysis.buildRequired) {
            // For node-server environment, we need to copy package.json and server.js
            if (instance.project.analysis.environment === "node-server") {
                finalSteps.push(
                    () => `COPY --from=builder /app/package*.json ./`,
                );

                // Check if we have custom files to copy
                if (instance.project.analysis.copyFiles) {
                    for (const file of instance.project.analysis.copyFiles) {
                        finalSteps.push(
                            () => `COPY --from=builder /app/${file} ./`
                        );
                    }
                }

                finalSteps.push(
                    () => `COPY --from=builder /app/${instance.project.analysis.buildDirectory.split("/").pop()} ./${instance.project.analysis.buildDirectory.split("/").pop()}`,
                    () => `RUN npm ci --only=production`
                );
            } else {
                finalSteps.push(
                    () => `COPY --from=builder /app/${instance.project.analysis.buildDirectory.split("/").pop()} .`
                );
            }
        } else {
            finalSteps.push(
                () => `COPY ${instance.project.analysis.buildDirectory.split("/").pop()} .`
            )
        }


        if (instance.project.analysis.env) {
            for (const [key, value] of Object.entries(instance.project.analysis.env)) {
                finalSteps.push(
                    () => `ENV ${key}=${value}`
                )
            }
        }


        for (const port of instance.project.analysis.requiredPorts) {
            finalSteps.push(
                () => `EXPOSE ${port}`
            )
        }

        if (instance.project.analysis.environment === "static-server") {
            finalSteps.push(
                () => `COPY dockview.nginx.conf /etc/nginx/conf.d/default.conf`
            )
        }

        finalSteps.push(
            () => `CMD ["${instance.project.analysis.commands.start.join('","')}"]`
        )

        const withBuild = [
            ...builderSteps,
            ...finalSteps
        ];

        const withoutBuild = [
            ...finalSteps
        ];

        const steps = instance.project.analysis.buildRequired ? withBuild : withoutBuild;

        return this.setContent(instance, steps);
    }

    private setContent(instance: DockviewInstance, steps: (() => string)[]): string {
        let content = "";
        for (const step of steps) {
            if (instance.shouldAbort) break;
            content += step() + "\n";
        }
        return content;
    }

    private getImage(instance: DockviewInstance, stage?: string): string {

        let image = "";
        switch (instance.project.analysis.environment) {
            case "node-server":
                image = this._NODE_IMAGE;
                break;
            case "static-server":
                image = stage === "builder" ? this._NODE_IMAGE : this._NGINX_IMAGE;
                break;
            default:
                instance.logs.logError("Unsupported environment", instance.project.analysis.environment);
                break;
        }


        if (stage) {
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
        switch (instance.project.analysis.environment) {
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