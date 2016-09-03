//Import encryption utils
var RSA = require('simple-encryption').RSA;
var AES = require('simple-encryption').AES;
//Error handler
var Error = require('../Utils/Error.js');
//handshake
var handshake = require('./Handshake.js');
//Export main function
module.exports = function(socket, eventHandler, serverPublicKey,
  clientPrivateKey, clientID, callback) {
    handshake(socket, serverPublicKey, function(sessionKey) {
    //Once handshake has been completed, listen to verification messages
    socket.onmessage = function(event) {
      var message = JSON.parse(event.data);
      if(Error.findError(message.error)) {
        //An error has occured
        console.log('Error: ' + Error.findError(message.error));
        return;
      }
      //Encryption information
      var payload = message.payload;
      var tag = message.tag;
      var iv = message.iv;

      //Try to decrypt
      var decrypted;
      try {
        decrypted = JSON.parse(AES.decrypt(sessionKey, iv, tag, payload));
      } catch(e) {
        console.log('Error: SECURITY_DECRYPTION_FAILURE');
        return;
      }

      //If authentication failed
      if(decrypted == null) {
        console.log('Error: STAGE_HANDSHAKE_POST_COMPLETE_FAILURE');
        return;
      }
      callback(decrypted.verified, sessionKey);
    };
    //Prepare verification section
    var signed, md;
    //Try to sign message
    try {
      var out = RSA.sign(clientPrivateKey, 'verify');
      signed = out.signed;
      md = out.md;
    } catch(e) {
      console.log('Error: SECURITY_SIGNING_FAILURE');
      return;
    }
    //Prepare json message for aes encryption
    var jsonmsg = {
      verify: signed,
      md: md
    };
    //Generate IV
    var iv = AES.generateIV();
    //Try to encrypt
    var encrypted;
    try {
      encrypted = AES.encrypt(sessionKey, iv, JSON.stringify(jsonmsg));
    } catch(e) {
      console.log('Error: SECURITY_ENCRYPTION_FAILURE');
      return;
    }
    //Send message to server
    try {
      socket.send(JSON.stringify({type: 'verify', id: clientID,
        payload: encrypted.encrypted, tag: encrypted.tag, iv: iv}));
    } catch(e) {
      //Destroy socket
      socket.close();
      return;
    }
  });
};
