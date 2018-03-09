let uuidv1 = require('uuid/v1');
let CryptoJS = require('crypto-js');

function generateUniqueSecret(){
  return uuidv1();
}

function encryptValue(value){
  let secret = getVariable('secret');
  let cipherText = CryptoJS.AES.encrypt(value, secret);
  return cipherText.toString();
}

function decryptValue(value){
  let secret = getVariable('secret');
  let text = CryptoJS.AES.decrypt(value, secret);
  return text;
}
