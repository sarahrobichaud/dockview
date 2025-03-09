import { NextFunction, Router, Request, Response } from "express"
import express from "express"

export interface RouterConfiguration {
    prefix: string
}


export const Method = {
    GET: "get",
    POST: "post",
    PUT: "put",
    DELETE: "delete"
} as const

export type Method = typeof Method[keyof typeof Method]


export type RouteHandler =
    ((req: Request, res: Response) => void) |
    ((req: Request, res: Response) => Promise<void>) |
    ((req: Request, res: Response, next: NextFunction) => Promise<void>) |
    ((req: Request, res: Response, next: NextFunction) => void)


export interface RouteRegistration {
    path: string
    method: Method
    handler: RouteHandler | RouteHandler[]
}

