import { Request, Response, NextFunction } from "express";
import { DockviewError } from "~/errors/DockviewError";

export const formatResponses = (req: Request, res: Response, next: NextFunction) => {
    res.success = (body: any, message: string = "Resource fetched successfully") => {
        return res.json({
            success: true,
            data: body,
            message: message,
            status: "success",
            timeStamp: new Date().toISOString(),
            path: req.path,
        });
    }
    next();
}

// errorHandler.js
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    console.log("err", err);

    // Check if the request accepts HTML
    const acceptsHtml = req.accepts('html');
    const acceptsJson = req.accepts('json');

    if (acceptsHtml && !req.path.startsWith('/api')) {
        // Render the error page for HTML requests
        return res.status(err.statusCode).render('error', {
            error: {
                statusCode: err.statusCode,
                message: process.env.NODE_ENV === 'production' && !err.isOperational
                    ? 'Something went wrong!'
                    : err.message,
                stack: process.env.NODE_ENV === 'development' ? err.stack : null
            }
        });
    }

    // Different error responses for development and production
    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            success: false,
            error: {
                status: err.status,
                message: err.message,
                path: req.originalUrl,
                statusCode: err.statusCode,
                stack: err.stack,
            },
            timestamp: new Date().toISOString()
        });
    } else {
        // Don't send error details in production
        res.status(err.statusCode).json({
            success: false,
            error: {
                status: err.status,
                message: err.isOperational ? err.message : 'Something went wrong!',
                path: req.originalUrl,
                statusCode: err.statusCode,
            },
            timestamp: new Date().toISOString()
        });
    }
}