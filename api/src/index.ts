import app from "./app";
import {config} from "dotenv";
import Server from "./server";
import {ENV} from "./config/env";

config();

const server = new Server(app, ENV.PORT.toString());
server.start();
