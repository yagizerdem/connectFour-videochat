const { SD } = require("../SD");

class User {
  constructor({
    username = null,
    socketid = null,
    roomid = null,
    appState = SD.appStates.searchMatch,
  }) {
    this.username = username;
    this.socketid = socketid;
    this.roomid = roomid;
    this.appState = appState;
  }
}
module.exports = { User };
