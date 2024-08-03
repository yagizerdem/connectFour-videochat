var DIcontainer;
const { Database } = require("../db");
const emitBoard = require("../emitters/emitBoard");
const emitError = require("../emitters/emitError");
const emitInfo = require("../emitters/emitInfo");
const { errorHandler } = require("../errorHandler");
const { Queue } = require("../models/Queue");
const { SD } = require("../SD");
(async () => {
  const module = await import("../DIcontainer.mjs");
  const { container } = module;
  DIcontainer = container;
})();

module.exports = (io, socket) => {
  function move({ rowindex, colindex }) {
    const dbService = DIcontainer.get(Database);
    const player = dbService.getPlayer(socket.id);
    const roomid = player.roomid;
    const room = dbService.getRoomById(roomid);
    const turn = room.turn;
    const board = room.board;
    if (
      !(
        (player == room.whitePlayer && turn == SD.colors.white) ||
        (player == room.blackPlayer && turn == SD.colors.black)
      )
    ) {
      emitError(player.socketid, "not your turn");
      return;
    }
    if (board[rowindex][colindex] != null) {
      emitError(player.socketid, "invalid move ");
      return;
    }
    if (room.isGameEnd) {
      emitError(player.socketid, "game ended");
      return;
    }

    board[rowindex][colindex] = turn * 1;

    // check game finis

    // rows
    let flag = false;

    outer: for (let i = 0; i < board.length; i++) {
      const queue = new Queue();
      for (let j = 0; j < board[0].length; j++) {
        if (board[i][j] == null) continue; // Skip null values

        queue.enqueue(board[i][j]);

        // Check if the front of the queue matches the current element
        while (!queue.isEmpty() && queue.front() !== board[i][j]) {
          queue.dequeue();
        }

        // Check if the queue size is 2
        if (queue.size() === 4) {
          flag = true;
          break outer; // Exit both loops
        }
      }
    }

    // cols
    outer: for (let i = 0; i < board[0].length; i++) {
      const queue = new Queue();
      for (let j = 0; j < board.length; j++) {
        if (board[j][i] == null) continue; // Skip null values

        queue.enqueue(board[j][i]);

        // Check if the front of the queue matches the current element
        while (!queue.isEmpty() && queue.front() !== board[j][i]) {
          queue.dequeue();
        }

        // Check if the queue size is 2
        if (queue.size() === 4) {
          flag = true;
          break outer; // Exit both loops
        }
      }
    }

    // diagonals
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        if (board[i][j] == null) continue;
        var prev = null;
        var isValid = true;
        for (var k = 0; k < 4; k++) {
          if (board[i + k]?.[j + k] == undefined) {
            isValid = false;
            break;
          }
          if (board[i + k][j + k] == null) {
            isValid = false;
            break;
          }
          if (!prev) {
            prev = board[i + k][j + k];
          } else if (prev != board[i + k][j + k]) {
            isValid = false;
            break;
          }
        }
        if (isValid) {
          flag = true;
          break;
        }
      }
    }
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        if (board[i][j] == null) continue;
        var prev = null;
        var isValid = true;
        for (var k = 0; k < 4; k++) {
          if (board[i - k]?.[j - k] == undefined) {
            isValid = false;
            break;
          }
          if (board[i - k][j - k] == null) {
            isValid = false;
            break;
          }
          if (!prev) {
            prev = board[i - k][j - k];
          } else if (prev != board[i - k][j - k]) {
            isValid = false;
            break;
          }
        }
        if (isValid) {
          flag = true;
          break;
        }
      }
    }
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        if (board[i][j] == null) continue;
        var prev = null;
        var isValid = true;
        for (var k = 0; k < 4; k++) {
          if (board[i + k]?.[j - k] == undefined) {
            isValid = false;
            break;
          }
          if (board[i + k][j - k] == null) {
            isValid = false;
            break;
          }
          if (!prev) {
            prev = board[i + k][j - k];
          } else if (prev != board[i + k][j - k]) {
            isValid = false;
            break;
          }
        }
        if (isValid) {
          flag = true;
          break;
        }
      }
    }

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        if (board[i][j] == null) continue;
        var prev = null;
        var isValid = true;
        for (var k = 0; k < 4; k++) {
          if (board[i - k]?.[j + k] == undefined) {
            isValid = false;
            break;
          }
          if (board[i - k][j + k] == null) {
            isValid = false;
            break;
          }
          if (!prev) {
            prev = board[i - k][j + k];
          } else if (prev != board[i - k][j + k]) {
            isValid = false;
            break;
          }
        }
        if (isValid) {
          flag = true;
          break;
        }
      }
    }

    if (flag) {
      room.isGameEnd = true;
      emitInfo(room.whitePlayer.socketid, "game end");
      emitInfo(room.blackPlayer.socketid, "game end");
    }

    room.turn = !room.turn;
    emitInfo(
      room.turn == SD.colors.white
        ? room.whitePlayer.socketid
        : room.blackPlayer.socketid,
      "your turn"
    );
    emitBoard(room.whitePlayer.socketid, board);
    emitBoard(room.blackPlayer.socketid, board);
  }

  socket.on("move", errorHandler(move));
};
