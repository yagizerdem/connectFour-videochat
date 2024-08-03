var DIcontainer;
const { Database } = require("../db");
const { errorHandler } = require("../errorHandler");
(async () => {
  const module = await import("../DIcontainer.mjs");
  const { container } = module;
  DIcontainer = container;
})();

module.exports = (io, socket) => {
  function chat(message) {
    if (!message) return;
    const dbService = DIcontainer.get(Database);
    const player = dbService.getPlayer(socket.id);
    const room = dbService.getRoomById(player?.roomid);

    io.to(room.whitePlayer.socketid).emit("chat", message);
    io.to(room.blackPlayer.socketid).emit("chat", message);
  }

  socket.on("sendchat", errorHandler(chat));
};
