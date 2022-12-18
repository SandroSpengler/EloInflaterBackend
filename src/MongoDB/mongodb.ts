import { connect } from "mongoose";
import { ConnectionOptions } from "tls";

/**
 * Connects to the MongoDB
 *
 * @param connection String used to connect to MongoDB
 */
const connectToMongoDB = async (connection: string | undefined) => {
	try {
		if (connection === undefined || connection === "") {
			throw new Error("No Connection String was provided");
		}

		const connectionOption: ConnectionOptions = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		} as ConnectionOptions;

		await connect(connection, connectionOption);

		console.log(`1: Connected to: ${formatMongoDBConnectionMessage(connection)}
		`);
	} catch (error) {
		console.log(error);
	}
};

/**
 * Cuts the host, port and database out of the mongodb connection string
 *
 * @param connectionString
 *
 * @returns formatted string
 */
const formatMongoDBConnectionMessage = (connectionString: string) => {
	const host: string = `${connectionString.split("@")[1].split(":")[0]}`;

	const port: string = `${connectionString.split(":")[3].split("/")[0]}`;

	const dbName: string = `${connectionString.split(":")[3].split("/")[1].split("?")[0]}`;

	return `${host} on ${port} using DB: ${dbName}`;
};

export { connectToMongoDB };
