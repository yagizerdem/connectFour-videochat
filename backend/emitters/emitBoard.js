const { getIo } = require("../io_");

const io = getIo();
module.exports = (socketid, board) => {
  return io.to(socketid).emit("boardJson", JSON.stringify(board));
};
