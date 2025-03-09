import { V1ErrorResponse, DockviewAPIResponse, V1SuccessResponse } from "../types/responses.js";

export type GetAllProjectsResponse = V1ErrorResponse | V1SuccessResponse<{
    message: string;
    result: string[];
}>

export type GetProjectVersionsResponse = DockviewAPIResponse<{
    message: string;
    result: string[];
}>;


type ContainerRequestResult = {
    containerURL: string;
    cold: boolean;
    statusURL: string;
};

export type RequestContainerResponse = DockviewAPIResponse<ContainerRequestResult>;
