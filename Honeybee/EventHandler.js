//Import events
const events = require('eventemitter3');

//Create EventHandler function
class EventHandler extends events {
  constructor() {
    super();
  }

  registered() {
    this.emit('registered');
  }

  request(callback) {
    this.emit('request', callback);
  }

  submit(data, callback) {
    this.emit('submit', data, callback);
  }
}

module.exports = EventHandler;
