/**
 * This Config contains a centeral entry point for environment variables
 */
const config = {
  PORT: Number(process.env.PORT) || 1337,
  DB_CONNECTION: process.env.DB_CONNECTION || "",
  LOGGLY_TOKEN: process.env.LOGGLY_TOKEN || "",
};

export {config};
