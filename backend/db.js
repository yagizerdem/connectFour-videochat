class Database {
  allPlayers; // Private field for allPlayers
  searchMatchQueue;
  allRooms;

  constructor() {
    this.searchMatchQueue = [];
    this.allPlayers = {};
    this.allRooms = {};
  }

  addPlayer(user) {
    this.allPlayers[user.socketid] = user;
  }
  removePlayer(socketid) {
    delete this.allPlayers[socketid];
  }
  getallPlayers() {
    return this.allPlayers;
  }
  getPlayer(socketid) {
    return this.allPlayers[socketid];
  }
  addToMatchQueue(user) {
    this.searchMatchQueue.push(user);
  }
  removeFromMatchQueue(socketid) {
    this.searchMatchQueue = this.searchMatchQueue.filter(
      (user) => user.socketid != socketid
    );
  }
  getMatchQueue() {
    return this.searchMatchQueue;
  }
}

module.exports = { Database };