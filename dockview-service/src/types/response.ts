import { RequestHandler } from "express";

interface V1BaseResponse {
  success: boolean;
  message?: string;
}

interface V1SuccessResponse<T extends {}> extends V1BaseResponse {
  success: true;
  resource: T;
}

interface V1ErrorResponse extends V1BaseResponse {
  success: false;
  message: string;
  data: null;
}

export type V1Response<T extends {}> = V1SuccessResponse<T> | V1ErrorResponse;

export type TypedRequestHandler<T extends {}> = RequestHandler<
  any,
  V1Response<T>,
  any,
  any
>;
