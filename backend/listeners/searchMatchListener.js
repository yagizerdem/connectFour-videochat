var DIcontainer;
const { Database } = require("../db");
const emitAppState = require("../emitters/emitAppState");
const emitRoomid = require("../emitters/emitRoomid");
const { matchMaking } = require("../engine/MatchMaking");
(async () => {
  const module = await import("../DIcontainer.mjs");
  const { container } = module;
  DIcontainer = container;
})();
const { errorHandler } = require("../errorHandler");
const { errorMessageMap } = require("../errorMessageMap");
const { User } = require("../models/User");
const { SD } = require("../SD");

module.exports = (io, socket) => {
  function search({ username }) {
    const dbService = DIcontainer.get(Database);
    const isUserExist = !dbService.getPlayer(socket.id) ? false : true;
    if (isUserExist) {
      throw new Error(errorMessageMap["user already exist"]);
    }
    const newUser = new User({
      username,
      socketid: socket.id,
      roomid: null,
      appState: SD.appStates.searchMatch,
    });
    // add new user
    dbService.addPlayer(newUser);
    // add to queue
    dbService.addToMatchQueue(newUser);

    const size = dbService.getMatchQueue().length;
    if (size >= 2) {
      matchMaking.emit("pair");
    }

    emitAppState(newUser.socketid, newUser.appState);
  }

  socket.on("searchMatch", errorHandler(search, socket.id));
};
