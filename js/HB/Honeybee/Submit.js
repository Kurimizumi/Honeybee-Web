//Import verification module
var verify = require('./Verify.js');
//Import AES module
var AES = require('simple-encryption').AES;
//Import error handler
var Error = require('../Utils/Error.js');
module.exports = function(socket, eventHandler, serverPublicKey,
  clientPrivateKey, clientID, data, callback) {
  verify(socket, eventHandler, serverPublicKey, clientPrivateKey, clientID,
    function(verified, sessionKey) {
    //If we're not verified
    if(verified == null) {
      console.log('Error: SECURITY_VERIFICATION_FAILURE');
      return;
    }
    //Receive status
    socket.once('message', function(message) {
      //If we get an error
      if(Error.findError(message.error)) {
        console.log('Error: ' + Error.findError(message.error));
        return;
      }
      //Get encryption information
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
      callback(decrypted.success);
    });
    //Prepare message for sending
    var jsonmsg = {
      data: data
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
    try {
      socket.sendMessage({type: 'submit', payload: encrypted.encrypted,
        tag: encrypted.tag, iv: iv});
    } catch(e) {
      //Destroy socket
      socket.destroy();
      return;
    }
  });
};
