import { VaultReader } from "~/lib/vault-reader/VaultReader";
import { VaultServiceContract } from "./interfaces/VaultServiceContract";
import { VaultRepository } from "~/repository/infrastructure/VaultRepository";
import { ProjectAnalyzer } from "~/lib/project-analyzer/ProjectAnalyzer";
import { VaultService } from "./infrastructure/VaultService";

export class VaultServiceFactory {
    public static create(path: string): VaultServiceContract {
        const vaultReader = new VaultReader(path);
        const configAnalyzer = new ProjectAnalyzer(vaultReader);

        const repository = new VaultRepository(vaultReader, configAnalyzer);
        return new VaultService(repository);
    }
}

const vaultReader = VaultServiceFactory.create("./harborvault");


console.log(await vaultReader.getPublicProjectDetails({name: "chromabay", version: "0.0.6"}));
console.log(await vaultReader.getPublicProjectDetails({name: "chromabay", version: "0.0.7"}));

