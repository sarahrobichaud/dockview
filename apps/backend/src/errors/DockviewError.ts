export class DockviewError extends Error {
    private _statusCode: number;
    private _status: string;
    private readonly _isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this._statusCode = statusCode;
        this._status = `${statusCode}`.startsWith('4') ? 'failure' : 'error';
        this._isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }

    get statusCode(): number {
        return this._statusCode;
    }

    set statusCode(statusCode: number) {
        this._statusCode = statusCode;
    }

    get status(): string {
        return this._status;
    }

    set status(status: string) {
        this._status = status;
    }

    get isOperational(): boolean {
        return this._isOperational;
    }
}