const { getIo } = require("../io_");

const io = getIo();
module.exports = (socketid, message) => {
  return io.to(socketid).emit("info", message);
};
