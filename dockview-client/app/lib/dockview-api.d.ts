// Generated by dts-bundle-generator v9.5.1

declare class VaultReaderError extends Error {
	readonly code: number;
	constructor(message: string, code?: number);
}
export type ExtractVaultReaderResult<T extends (...args: any) => any> = NonNullable<ReturnType<T>[0]>;
export type VaultReaderErrorResult = [
	null,
	VaultReaderError
];
export type VaultReaderSuccessResult<T> = [
	{
		message: string;
		result: T;
	},
	null
];
export type VaultReaderResult<T> = VaultReaderSuccessResult<T> | VaultReaderErrorResult;
export type ReadAllProjectsResult = VaultReaderResult<string[]>;
export type ReadProjectVersions = VaultReaderResult<string[]>;
export type ProjectAssetPathResult = VaultReaderResult<string>;
export type ReadProjectVersionsOptions = {
	minimum: string;
	maximum: string;
};
declare class VaultReader {
	private vaultPath;
	constructor(absoluteVaultPath: string);
	readAllProjects(): ReadAllProjectsResult;
	readProjectVersions(projectName: string, options?: ReadProjectVersionsOptions): ReadProjectVersions;
	getProjectAssetPath(projectName: string, version: string): ProjectAssetPathResult;
	private validateProject;
	private getProjectPath;
}
declare const vaultReader: VaultReader;
export interface V1BaseResponse {
	success: boolean;
	message?: string;
}
export interface V1SuccessResponse<T extends {}> extends V1BaseResponse {
	success: true;
	resource: T;
}
export interface V1ErrorResponse extends V1BaseResponse {
	success: false;
	message: string;
	type: string;
	code: number;
	resource: null;
}
export type V1Response<T extends {}> = V1SuccessResponse<T> | V1ErrorResponse;
export type AllProjects = ExtractVaultReaderResult<typeof vaultReader.readAllProjects>;
export type GetAllProjectsResponse = V1Response<AllProjects>;
export type ProjectVersions = ExtractVaultReaderResult<typeof vaultReader.readProjectVersions>;
export type GetProjectVersionsResponse = V1Response<ProjectVersions>;
export type ContainerRequestResult = {
	containerURL: string;
	cold: boolean;
};
export type RequestContainerResponse = V1Response<ContainerRequestResult>;

export {};
