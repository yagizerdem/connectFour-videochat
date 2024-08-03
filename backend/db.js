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
  getRooms() {
    return this.allRooms;
  }
  getRoomById(roomid) {
    return this.allRooms[roomid];
  }
  addRoom(newRoom) {
    this.allRooms[newRoom.roomid] = newRoom;
  }
  removeRoom(roomid) {
    delete this.allRooms[roomid];
  }
}

module.exports = { Database };
