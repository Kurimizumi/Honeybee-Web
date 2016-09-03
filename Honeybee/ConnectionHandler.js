//Set storage to localStorage
var storage = localStorage;

//Sections
var register = require('./Register.js');
var request = require('./Request.js');
var submit = require('./Submit.js');

var main = function(address, port, serverPublicKey, eventHandler,
  clientPrivateKey, clientID) {
  //Register for alerts
  eventHandler.on('request', function(callback) {
    //Create socket
    var socket = new WebSocket('ws://' + address + ':' + port);
    //Wait until we are connected
    socket.onopen = function(event) {
      request(socket, eventHandler, serverPublicKey,
        clientPrivateKey, clientID, callback);
    };
  });
  eventHandler.on('submit', function(data, callback) {
    //Create socket
    var socket = new JsonSocket(net.connect({host: address, port: port}));
    //Wait until we are connected
    socket.on('connect', function() {
      submit(socket, eventHandler, serverPublicKey,
        clientPrivateKey, clientID, data, callback);
    });
  });
  //Alert client that we have registered and are ready for work
  eventHandler.registered();
};
//Export the main function
module.exports = function(eventHandler, settings) {
  //Load private key
  var clientPrivateKey = storage.getItem('key');
  //If not registered
  if(clientPrivateKey == null) {
    //Create socket
    var socket = new WebSocket('ws://' + settings.connection.hostname + ':' +
      settings.connection.port);
    //Wait for connection
    socket.onopen = function(event) {
      //Call register function
      register(socket, eventHandler, storage, settings.encryption.key,
        function(clientPrivateKey, clientID) {
        //Once finished, get the private key and clientID call the main function
        main(settings.connection.hostname, settings.connection.port,
          settings.encryption.key, eventHandler, clientPrivateKey, clientID);
      });
    };
    //Stop execution (main is called once connected)
    return;
  }
  var clientID = storage.getItem('id');
  main(settings.connection.hostname, settings.connection.port,
    settings.encryption.key, eventHandler, clientPrivateKey, clientID);
};
