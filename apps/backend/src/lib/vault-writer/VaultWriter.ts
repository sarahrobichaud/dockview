import { ProjectQuery, ProjectQueryWithAnalysis } from "@dockview/core/shared";

import fs from "fs";
import path from "path";
import type { VaultReaderContract } from "../vault-reader/VaultReaderContract";
import type { VaultWriterContract } from "./VaultWriterContract";


export class VaultWriter implements VaultWriterContract {


    constructor(
        private _reader: VaultReaderContract
    ) { }

    writeFileToProjectVersion(query: ProjectQuery | ProjectQueryWithAnalysis, fileName: string, contents: any): void {
        try {
            const basePath = this.extractPath(query);
            const filePath = path.join(basePath, fileName);

            this.log(`Writing file to: ${filePath}`);

            fs.writeFileSync(filePath, contents);
        } catch (e) {
            throw e;
        }
    }



    private extractPath(query: ProjectQuery | ProjectQueryWithAnalysis): string {
        if ("analysis" in query) {
            return query.analysis.sourceDirectory;
        }

        return this._reader.getProjectVersionPath(query);
    }

    private log(message: string): void {
        console.log("[VaultWriter] " + message);
    }
}