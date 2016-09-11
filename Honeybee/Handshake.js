'use strict';
//Require the encryption modules
const RSA = require('simple-encryption').RSA;
const AES = require('simple-encryption').AES;
//Error handler
const errorHandler = require('../error/errorHandler.js');
const errorList = require('../error/errorList.js');
//Export main function
module.exports = function(socket, serverPublicKey, callback) {
  //Generate a session key
  const sessionKey = AES.generateKey();
  //Encrypt it with the serverPublicKey
  let encrypted;
  //Attempt to encrypt, otherwise error to user
  try {
    encrypted = RSA.encrypt(serverPublicKey, JSON.stringify({key: sessionKey}));
  } catch(e) {
    //Return to user
    return callback(new errorList.SecurityEncryptionFailure());
  }
  //Listen only once
  socket.onmessage = function(event) {
    const message = JSON.parse(event.data);
    if(message.error) {
      //Error has occured
      return callback(errorHandler.createError(message.error));
    }
    const payload = message.payload;
    const tag = message.tag;
    const iv = message.iv;
    //Try to decrypt
    let decrypted;
    try {
      decrypted = JSON.parse(AES.decrypt(sessionKey, iv, tag, payload));
    } catch(e) {
      return callback(new errorList.SecurityDecryptionFailure());
    }
    //Tag wasn't correct
    if(decrypted == null) {
      return callback(new errorList.HandshakeGeneric());
    }
    //Callback to the caller with the challenge, sessionKey, and no error
    callback(null, decrypted, sessionKey);
  };
  //Send a message
  try {
    socket.send(JSON.stringify({type: 'handshake', payload: encrypted}));
  } catch(e) {
    //Destroy socket
    socket.close();
    return;
  }
};
