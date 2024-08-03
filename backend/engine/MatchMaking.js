const { v4: uuidv4 } = require("uuid");
var DIcontainer;
const { Database } = require("../db");
(async () => {
  const module = await import("../DIcontainer.mjs");
  const { container } = module;
  DIcontainer = container;
  dbService = DIcontainer.get(Database);
})();
const axios = require("axios").default;

const EventEmitter = require("node:events");
const { Room } = require("../models/Room");
const { SD } = require("../SD");
const emitAppState = require("../emitters/emitAppState");
const emitRoomid = require("../emitters/emitRoomid");
const { createBoard } = require("./createBoard");
const emitBoard = require("../emitters/emitBoard");
const emitTurn = require("../emitters/emitTurn");
class MatchMaking extends EventEmitter {}
const matchMaking = new MatchMaking();

var pointer = null;

matchMaking.on("pair", () => {
  if (pointer) return;
  pointer = setInterval(() => {
    const dbService = DIcontainer.get(Database);
    const queue = dbService.getMatchQueue();
    if (queue.length <= 1) {
      // clear loop
      clearInterval(pointer);
      pointer = null;
      return;
    }

    const p1 = queue.shift();
    const p2 = queue.shift();

    const shuffled = [p1, p2].sort(() => 0.5 - Math.random());
    const roomid = uuidv4();

    const newRoom = new Room({
      roomid,
      whitePlayer: shuffled[0],
      blackPlayer: shuffled[1],
      board: createBoard(),
    });
    p1.roomid = roomid;
    p2.roomid = roomid;

    p1.appState = SD.appStates.inGame;
    p2.appState = SD.appStates.inGame;

    dbService.addRoom(newRoom);

    emitAppState(p1.socketid, p1.appState);
    emitAppState(p2.socketid, p2.appState);
    emitRoomid(p1.socketid, roomid);
    emitRoomid(p2.socketid, roomid);
    emitBoard(p1.socketid, newRoom.board);
    emitBoard(p2.socketid, newRoom.board);
    emitTurn(newRoom.whitePlayer.socketid, true);
    emitTurn(newRoom.blackPlayer.socketid, false);

    // console.log(p1, p2);

    axios
      .post(
        "https://api.daily.co/v1/rooms",
        {
          // Body parameters go here
          name: roomid, // Example body parameter
          properties: {
            enable_emoji_reactions: true,
            start_video_off: true,
            start_audio_off: true,
            enable_advanced_chat: true,
          },
        },
        {
          headers: {
            Authorization: "Bearer " + process.env.DailyCoApiKey,
          },
        }
      )
      .then((response) => {})
      .catch((err) => {
        console.log(err);
      });

    // create video chat room
  }, 100);
});
matchMaking.on("stop", () => {
  clearInterval(pointer);
  pointer = null;
});

module.exports = { matchMaking };
