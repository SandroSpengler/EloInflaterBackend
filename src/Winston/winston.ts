import { format } from "winston";
import { Loggly } from "winston-loggly-bulk";

import * as winston from "winston";

const { combine, timestamp, label, printf } = format;

/**
 * Creates the logger instance
 *
 * @param token Loggly token for remote logs
 */
const createWinstonLoggerWithLoggly = async (token: string | undefined) => {
  try {
    // if (token === undefined) {
    //   throw new Error("No Loggly token was provided");
    // }

    // const LogglyLogger: Loggly = new Loggly({
    //   token: token,
    //   subdomain: "eloinflater",
    //   tags: ["Node-JS", process.env.NODE_ENV],
    //   json: true,
    // });

    const myFormat = printf(({ level, message, label, timestamp }) => {
      return `${timestamp} [${label}] ${level}: ${message}`;
    });

    const FileLogger = winston.createLogger({
      transports: [new winston.transports.File({ filename: "Logs/Global.log" })],
      format: combine(
        label({
          label: "EloInflater",
        }),
        timestamp(),
        myFormat,
        format.json(),
      ),
    });

    // winston.add(LogglyLogger);
    winston.add(FileLogger);

    await winston.log("info", "Loggly created");
  } catch (error) {
    console.log(error);
  }
};

export { createWinstonLoggerWithLoggly };
