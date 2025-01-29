import { VaultReader } from "~/lib/vault-reader/VaultReader";
import { VaultServiceContract } from "./interfaces/VaultServiceContract";
import { VaultRepository } from "~/repository/infrastructure/VaultRepository";
import { ConfigurationAnalyzer } from "~/lib/config-analyzer/ConfigurationAnalyzer";
import { VaultService } from "./infrastructure/VaultService";

export class VaultServiceFactory {
    public static create(path: string): VaultServiceContract {
        const vaultReader = new VaultReader(path);
        const repository = new VaultRepository(vaultReader);
        const configAnalyzer = new ConfigurationAnalyzer();
        return new VaultService(repository, configAnalyzer);
    }
}

const vaultReader = VaultServiceFactory.create("./harborvault");

console.log(vaultReader.getProjectList());

console.log(vaultReader.getProjectByName("harbor"));
console.log(vaultReader.getProjectByName("chromabay"));

