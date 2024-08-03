const { SD } = require("../SD");

class Room {
  constructor({
    roomid = null,
    whitePlayer = null,
    blackPlayer = null,
    board = null,
    activePlayerCount = 2,
    turn = SD.colors.white,
  }) {
    this.roomid = roomid;
    this.whitePlayer = whitePlayer;
    this.blackPlayer = blackPlayer;
    this.board = board;
    this.activePlayerCount = activePlayerCount;
    this.turn = turn;
    this.isGameEnd = false;
  }
}

module.exports = { Room };
