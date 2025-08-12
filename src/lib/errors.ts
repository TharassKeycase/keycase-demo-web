import type { NextApiResponse } from "next";


export interface ApiError {
    code: number;
    error: string;
}

export function sendTechnicalError(
    res: NextApiResponse,
    error?: unknown,
): void {
    if (error) {
        // Log the detailed error information for analysis (todo: could integrate with a logging service here)
        console.error("Technical error:", error);
    }

    res
        .status(500)
        .json({ error: "Technical error" });
}

export function sendNotFound(
    res: NextApiResponse,
    message: string = "Not found",
): void {
    res.status(404).json({ error: message });
}

export function sendMethodNotAllowed(
    res: NextApiResponse,
    method: string = "unknown",
    path: string = "unknown",
): void {
    console.log("Method not allowed", method, path);
    res.status(405).json({
        error: `Method ${method} is not allowed on ${path}`,
    });
}

export class ValidationError extends Error {
    public statusCode: number;
    public errorCode: number;
    public message: string = "Validation error";

    constructor(
        errorCode: number,
        statusCode: number = 400,
        message: string = "Validation error",
    ) {

        super(message);
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.message = message;
        this.name = this.constructor.name;
    }
}