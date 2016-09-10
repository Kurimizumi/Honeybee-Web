'use strict';
//Import encryption utils
const RSA = require('simple-encryption').RSA;
const AES = require('simple-encryption').AES;
//Error handler
const errorHandler = require('../error/errorHandler.js');
const errorList = require('../error/errorList.js');
//handshake
const handshake = require('./Handshake.js');
//Export main function
module.exports = function(socket, eventHandler, serverPublicKey,
  clientPrivateKey, clientID, callback) {
      handshake(socket, serverPublicKey, function(error, sessionKey) {
    //If an error occured, pass it to the user
    if(error) {
      return callback(error);
    }
    //Once handshake has been completed, listen to verification messages
    socket.onmessage = function(event) {
      const message = JSON.parse(event.data);
      if(message.error) {
        //Create the error
        let err = errorHandler.createError(message.error);
        //If it's a registration failure, invalidate saved information and
        //revalidate
        if(err instanceof errorList.SecurityVerificationFailure) {
          //TODO: Reregister user
          //NOTE: Not sure on how this will be done yet
        }
        //An error has occured
        return callback(err);
      }
      //Encryption information
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

      //If authentication failed
      if(decrypted == null) {
        return callback(new errorList.HandshakePostCompleteFailure());
      }
      if(!decrypted.verified) {
        //TODO: Reregister user
        return callback(new errorList.SecurityVerificationFailure());
      }
      callback(null, decrypted.verified, sessionKey);
    };
    //Prepare verification section
    let signed, md;
    //Try to sign message
    try {
      let out = RSA.sign(clientPrivateKey, 'verify');
      signed = out.signed;
      md = out.md;
    } catch(e) {
      return callback(new errorList.SecuritySigningFailure());
    }
    //Prepare json message for aes encryption
    let jsonmsg = {
      verify: signed,
      md: md
    };
    //Generate IV
    let iv = AES.generateIV();
    //Try to encrypt
    let encrypted;
    try {
      encrypted = AES.encrypt(sessionKey, iv, JSON.stringify(jsonmsg));
    } catch(e) {
      return callback(new errorList.SecurityEncryptionFailure());
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
