export interface DockviewAPISuccess<T> {
    success: true;
    data: T;
    message: string;
    status: "success";
    timestamp: string;
    path: string;
}

export interface DockviewAPIFailure {
    success: false;
    error: {
        status: string;
        message: string;
        path: string;
        statusCode: number;
        stack?: string;
    }
    timestamp: string;
}

export type DockviewAPIResponse<T> = DockviewAPISuccess<T> | DockviewAPIFailure;