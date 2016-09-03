//GENERIC IMPORTS
//Import event emitter in order for people to be able to listen to events fired
//by us
var events = require('events');

//Import deep-defaults, the default settings module
var defaults = require('deep-defaults');

//HONEYBEE IMPORTS
//Import Honeybee's ConnectionHandler
var honeybeeConnectionHandler = require('./Honeybee/ConnectionHandler.js');
//Import Honeybee's EventHandler
var HoneybeeEventHandler = require('./Honeybee/EventHandler.js');
//Create Honeybee prototype, for the client
//address = string hostname of the server
//port = listening port of the server
//key = public RSA key of the server
var Honeybee = function(settings, callback) {
  //Set default settings
  this.settings = defaults(settings, {
    connection: {
      hostname: 'localhost',
      port: 54321
    }
  });
  //Set settings to indivial variables
  this.hostname = this.settings.connection.hostname;
  this.port = this.settings.connection.port;
  this.key = this.settings.encryption.key;
  //Create an instance of eventEmitter in order to be able to use it later
  this.eventHandler = new HoneybeeEventHandler();
  //Pass the eventHandler back to the client
  callback(this.eventHandler);
  //Call the connection handler
  honeybeeConnectionHandler(this.hostname, this.port, this.key,
    this.eventHandler);
};

//Export functions
module.exports = Honeybee;
