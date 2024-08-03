var DIcontainer;
const { Database } = require("../db");
const { matchMaking } = require("../engine/MatchMaking");
const { errorHandler } = require("../errorHandler");
(async () => {
  const module = await import("../DIcontainer.mjs");
  const { container } = module;
  DIcontainer = container;
})();

const axios = require("axios").default;

module.exports = (io, socket) => {
  function disconnect() {
    const dbService = DIcontainer.get(Database);
    const roomid = dbService.getPlayer(socket.id).roomid;
    dbService.removePlayer(socket.id);
    dbService.removeFromMatchQueue(socket.id);

    const size = dbService.getMatchQueue().length;
    if (size <= 1) {
      matchMaking.emit("stop");
    }

    const room = dbService.getRoomById(roomid);
    room.activePlayerCount--;

    if (room.activePlayerCount == 0) {
      // delete video chat room

      axios
        .delete(`https://api.daily.co/v1/rooms/${roomid}`, {
          headers: {
            Authorization: "Bearer " + process.env.DailyCoApiKey,
          },
        })
        .then((response) => {})
        .catch((err) => {
          console.log(err);
        });

      // delet room from db
      dbService.removeRoom(roomid);
    }
  }

  socket.on("disconnect", errorHandler(disconnect));
};
