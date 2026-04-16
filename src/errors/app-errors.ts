export class AppError extends Error {
	public readonly code: number;
	constructor(message: string, code: number ) {
		super(message);
		this.code = code;
	}
}

export class NotFoundError extends AppError {
	constructor(resourceName: string) {
		super(`${resourceName} not found`, 404);
	}
}

export class BadRequestError extends AppError {
	constructor(message: string = "Bad request!") {
		super(message, 400);
	}
}

export class ConflictError extends AppError {
	constructor(message: string = "Resource already exists") {
		super(message, 409);
	}
}

export class ValidationError extends AppError {
	constructor(message: string) {
		super(`Validation error: ${message}`, 422);
	}
}

export class AuthenticationError extends AppError {
	constructor(message: string) {
		super(`Authentication error: ${message}`, 401);
	}
}

export enum PrismaErrors {
	NOT_FOUND = "P2025",
	CONFLICT = "P2002",
}