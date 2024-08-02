const { getIo } = require("../io_");

const io = getIo();
module.exports = (socketid, state) => {
  return io.to(socketid).emit("appState", state);
};
