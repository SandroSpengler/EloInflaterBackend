import HttpError from "./HttpError";

export class InternalServer extends HttpError {
	constructor(errorMessage: string, httpStatusCode: number) {
		super(errorMessage, httpStatusCode);
	}
}
