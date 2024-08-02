var DIcontainer;
var dbService;
const { Database } = require("../db");
(async () => {
  const module = await import("../DIcontainer.mjs");
  const { container } = module;
  DIcontainer = container;
  dbService = DIcontainer.get(Database);
})();

const EventEmitter = require("node:events");
class MatchMaking extends EventEmitter {}
const matchMaking = new MatchMaking();

var pointer = null;

matchMaking.on("pair", () => {
  if (pointer) return;
  pointer = setInterval(() => {
    const queue = dbService.getMatchQueue();
    if (queue.length <= 1) {
      // clear loop
      clearInterval(pointer);
      pointer = null;
      return;
    }

    const p1 = queue.shift();
    const p2 = queue.shift();

    // create room

    // console.log(p1, p2);
  }, 100);
});
matchMaking.on("stop", () => {
  clearInterval(pointer);
  pointer = null;
});

module.exports = { matchMaking };
