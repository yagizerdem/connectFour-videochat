const { getIo } = require("../io_");

const io = getIo();
module.exports = (socketid, roomid) => {
  return io.to(socketid).emit("roomid", roomid);
};
