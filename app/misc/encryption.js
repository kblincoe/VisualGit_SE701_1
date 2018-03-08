var uuidv1 = require('uuid/v1');
var CryptoJS = require('crypto-js');
function generateUniqueSecret() {
    return uuidv1();
}
function encryptValue(value) {
    var secret = getVariable('secret');
    var cipherText = CryptoJS.AES.encrypt(value, secret);
    return cipherText.toString();
}
function decryptValue(value) {
    var secret = getVariable('secret');
    var text = CryptoJS.AES.decrypt(value, secret);
    return text;
}
