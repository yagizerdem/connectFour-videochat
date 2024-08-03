const { getIo } = require("../io_");

const io = getIo();
module.exports = (socketid, turn) => {
  return io.to(socketid).emit("turn", turn);
};
