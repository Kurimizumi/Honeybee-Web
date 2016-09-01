//Import events
var events = require('eventemitter3');

//Create EventHandler function
var EventHandler = function() {
  //Call the EventEmitter constructor on this object
  events.call(this);
  //Create the registered event
  this.registered = function() {
    this.emit('registered');
  };
  //Request event
  //callback is the callback used once work is received
  this.request = function(callback) {
    this.emit('request', callback);
  };

  //Submit event
  //callback is the callback once submitted work is confirmed
  this.submit = function(data, callback) {
    this.emit('submit', data, callback);
  };
};
EventHandler.prototype = Object.create(events.prototype);
EventHandler.prototype.constructor = EventHandler;

module.exports = EventHandler;
