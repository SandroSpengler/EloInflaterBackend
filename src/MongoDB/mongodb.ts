import {connect} from "mongoose";
import {ConnectionOptions} from "tls";

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

    console.log("1: Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};

export {connectToMongoDB};
