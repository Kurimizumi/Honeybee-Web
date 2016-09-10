//Set storage to localStorage
const storage = localStorage;

//Sections
const register = require('./Register.js');
const request = require('./Request.js');
const submit = require('./Submit.js');

const main = function(address, port, serverPublicKey, eventHandler,
  clientPrivateKey, clientID) {
  //Register for alerts
  eventHandler.on('request', function(callback) {
    //Create socket
    const socket = new WebSocket('ws://' + address + ':' + port);
    //Wait until we are connected
    socket.onopen = function(event) {
      request(socket, eventHandler, serverPublicKey,
        clientPrivateKey, clientID, callback);
    };
  });
  eventHandler.on('submit', function(data, callback) {
    //Create socket
    const socket = new WebSocket('ws://' + address + ':' + port);
    //Wait until we are connected
    socket.onopen = function(event) {
      submit(socket, eventHandler, serverPublicKey,
        clientPrivateKey, clientID, data, callback);
    };
  });
  //Alert client that we have registered and are ready for work
  eventHandler.registered();
};
//Export the main function
module.exports = function(eventHandler, settings) {
  //Load private key
  const clientPrivateKey = storage.getItem('key');
  //What's our private key?
  //If not registered
  if(clientPrivateKey == null) {
    //Create socket
    const socket = new WebSocket('ws://' + settings.connection.hostname + ':' +
      settings.connection.port);
    //Wait for connection
    socket.onopen = function(event) {
      //Call register function
      register(socket, eventHandler, storage, settings.encryption.key,
        function(error, clientPrivateKey, clientID) {
        //Once finished, get the private key and clientID call the main function
        main(settings.connection.hostname, settings.connection.port,
          settings.encryption.key, eventHandler, clientPrivateKey, clientID);
      });
    };
    //Stop execution (main is called once connected)
    return;
  }
  const clientID = storage.getItem('id');
  main(settings.connection.hostname, settings.connection.port,
    settings.encryption.key, eventHandler, clientPrivateKey, clientID);
};
