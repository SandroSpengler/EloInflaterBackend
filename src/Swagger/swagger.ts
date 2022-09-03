import { Application, Request, Response } from "express";

import swaggerJSDoc, { Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { version } from "../../package.json";

/**
 * Options for the Swagger Documentation
 * @see https://github.com/Surnet/swagger-jsdoc
 */
const swaggerOptions: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EloInflater REST API Documentation",
      version: version,
    },
  },
  apis: ["src/app.ts", "src/Models/Interfaces/*.ts", "src/Route/Api/Data/*.ts"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

/**
 * Generate the Swagger UI Interface
 *
 * @see https://www.npmjs.com/package/swagger-ui-express
 *
 * @param app The express App
 * @param port The Port of the Application
 */
const swaggerSetup = (APP: Application, port: number) => {
  // Swagger Endpoint/Page
  APP.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  // Swagger Docs in JSON Format
  APP.get("swagger.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");

    res.send(swaggerDocs);
  });

  console.log(`0. Swagger Docs available on PORT: ${port}`);
};

export { swaggerSetup };