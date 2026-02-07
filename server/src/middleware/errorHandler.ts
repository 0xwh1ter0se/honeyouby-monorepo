import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
    statusCode?: number;
    code?: string;
}

export function errorHandler(
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error("Error:", err);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";

    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
}

// Utility to create API errors
export class ApiError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = "ApiError";
    }

    static badRequest(message: string = "Bad request") {
        return new ApiError(message, 400);
    }

    static unauthorized(message: string = "Unauthorized") {
        return new ApiError(message, 401);
    }

    static forbidden(message: string = "Forbidden") {
        return new ApiError(message, 403);
    }

    static notFound(message: string = "Not found") {
        return new ApiError(message, 404);
    }
}
