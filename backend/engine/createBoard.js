const { SD } = require("../SD");

function createBoard() {
  const board = [];
  for (let i = 0; i < 6; i++) {
    const row = [];
    for (let j = 0; j < 7; j++) {
      row.push(null);
    }
    board.push(row);
  }
  return board;
}
module.exports = { createBoard };
