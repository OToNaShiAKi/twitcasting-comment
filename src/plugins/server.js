import { Server } from "socket.io";
import { createServer } from "http";
import speech from "../speech.json";

const server = createServer();
const io = new Server(server, {
  cors: {
    origin: ["https://localhost"],
    credentials: true,
  },
});

io.Setting = {};
io.on("connection", (socket) => socket.emit("Setting", io.Setting));

server.listen(9669);

server.on("request", async (request, response) => {
  response.writeHead(200, {
    "Content-Type": "text/html",
    "Access-Control-Allow-Origin": "http://localhost:9669/",
  });
  response.end(Buffer.from(speech));
});

export default io;
