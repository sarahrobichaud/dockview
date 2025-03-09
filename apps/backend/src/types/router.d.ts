import { NextFunction, Request, Response } from "express";
export interface RouterConfiguration {
    prefix: string;
}
export declare const Method: {
    readonly GET: "get";
    readonly POST: "post";
    readonly PUT: "put";
    readonly DELETE: "delete";
};
export type Method = typeof Method[keyof typeof Method];
export type RouteHandler = ((req: Request, res: Response) => void) | ((req: Request, res: Response) => Promise<void>) | ((req: Request, res: Response, next: NextFunction) => Promise<void>) | ((req: Request, res: Response, next: NextFunction) => void);
export interface RouteRegistration {
    path: string;
    method: Method;
    handler: RouteHandler | RouteHandler[];
}
//# sourceMappingURL=router.d.ts.map