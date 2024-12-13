
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
