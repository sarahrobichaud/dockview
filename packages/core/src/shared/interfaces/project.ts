export interface ProjectQuery {
    name: string;
    version: string;
}

export type ProjectDetails = {
    name: string;
    versions: string[];
}

export type ProjectVersionDetail = {
    version: string;
    type: "static" | "static-server" | "node-server" ;
}
