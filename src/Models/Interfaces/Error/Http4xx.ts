import HttpError from "./HttpError";

export class Conflict extends HttpError {
	constructor(errorMessage: string, httpStatusCode: number) {
		super(errorMessage, httpStatusCode);
	}
}

export class NotFound extends HttpError {
	constructor(errorMessage: string, httpStatusCode: number) {
		super(errorMessage, httpStatusCode);
	}
}

export class BadRequest extends HttpError {
	constructor(errorMessage: string, httpStatusCode: number) {
		super(errorMessage, httpStatusCode);
	}
}
