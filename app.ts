import { Server } from "./model/server";
import dotenv from "dotenv"

dotenv.config()

const server = new Server()

server.listen()