const { Database } = require("./db");
const { setIo, getIo } = require("./io_");
(async () => {
  const module = await import("./DIcontainer.mjs");
  const { container } = module;
  container.register("database", Database);
})();

const express = require("express");
const app = express();
const http = require("http");
var cors = require("cors");
app.use(cors());

const server = http.createServer(app);
const { Server } = require("socket.io");
setIo(new Server(server));
const io = getIo();

const registerDisconnectHandler = require("./listeners/disconnectListner");
const registerSearchMatchHandler = require("./listeners/searchMatchListener");

io.on("connection", (socket) => {
  registerDisconnectHandler(io, socket);
  registerSearchMatchHandler(io, socket);
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
