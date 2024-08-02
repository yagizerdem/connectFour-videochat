var DIcontainer;
const { Database } = require("../db");
const { matchMaking } = require("../engine/MatchMaking");
(async () => {
  const module = await import("../DIcontainer.mjs");
  const { container } = module;
  DIcontainer = container;
})();
module.exports = (io, socket) => {
  function disconnect() {
    const dbService = DIcontainer.get(Database);
    dbService.removePlayer(socket.id);
    dbService.removeFromMatchQueue(socket.id);

    const size = dbService.getMatchQueue().length;
    if (size <= 1) {
      matchMaking.emit("stop");
    }
  }

  socket.on("disconnect", disconnect);
};
