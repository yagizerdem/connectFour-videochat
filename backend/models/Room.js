class Room {
  constructor({
    roomid = null,
    whitePlayer = null,
    blackPlayer = null,
    board = null,
  }) {
    this.roomid = roomid;
    this.whitePlayer = whitePlayer;
    this.blackPlayer = blackPlayer;
    this.board = board;
  }
}

module.exports = { Room };
