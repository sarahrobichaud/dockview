import { V1ErrorResponse, V1Response, V1SuccessResponse } from "../types/responses.js";

export type GetAllProjectsResponse = V1ErrorResponse | V1SuccessResponse<{
    message: string;
    result: string[];
}>

export type GetProjectVersionsResponse = V1Response<{
    message: string;
    result: string[];
}>;


type ContainerRequestResult = {
    containerURL: string;
    cold: boolean;
    statusURL: string;
};

export type RequestContainerResponse = V1Response<ContainerRequestResult>;
