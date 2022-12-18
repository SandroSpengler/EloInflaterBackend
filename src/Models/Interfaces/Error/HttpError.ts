export default class HttpError extends Error {
	public httpStatusCode: number;

	constructor(errorMessage: string, httpStatusCode) {
		super(errorMessage);

		this.httpStatusCode = httpStatusCode;
	}
}
