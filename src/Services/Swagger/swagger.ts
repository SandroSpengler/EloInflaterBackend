import { Application, Request, Response } from "express";

import swaggerUi from "swagger-ui-express";

import * as swaggerJSON from "../../Public/swagger.json";

// const swaggerDocs = swaggerJSDoc(swaggerOptions);

/**
 * Generate the Swagger UI Interface
 *
 * @see https://www.npmjs.com/package/swagger-ui-express
 *
 * @param app The express App
 * @param port The Port of the Application
 */
const swaggerSetup = (APP: Application, port: number) => {
	APP.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerJSON));

	// Swagger Docs in JSON Format
	APP.use("/swagger.json", (req: Request, res: Response) => {
		res.setHeader("Content-Type", "application/json");

		res.send(swaggerJSON);
	});

	console.log(`0. Swagger Docs available on PORT: ${port}`);
};

export { swaggerSetup };

/**
 * @openapi
 * components:
 *  responses:
 *    SuccessSingleSummoner:
 *      description: The Requested Summoner
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Summoner'
 *    SuccesMultipleSummoner:
 *      description: The Requested Summoner
 *      content:
 *        application/json:
 *          schema:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Summoner'
 *    SuccesMultipleMatch:
 *      description: The Requested Match
 *      content:
 *        application/json:
 *          schema:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Match'
 *    SuccesUpdateMatchBySummonerId:
 *      description: Summoner Matches succesfully updated
 *    BadRequest:
 *      description: Request does not match specification
 *    NotFound:
 *      description: Requested ressource was not found
 *    Conflict:
 *      description: Request conflicts with the current state of the server
 *    TooManyRequests:
 *      description: Too many requests
 *    InternalServerError:
 *      description: Internal server error occurred
 */
