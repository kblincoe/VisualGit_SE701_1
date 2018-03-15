let ls = require('local-storage');

function storeUsername(username){
  storeVariable('username', username)
}

function getUsername(){
  return getVariable('username');
}

function storeVariable(name, value){
    ls.set(name,value);
}

function getVariable(name){
  return ls.get(name);
}

function storePassword(password){
  storeVariable('password', password);
}

function getPassword(){
  return getVariable('password');
}

function clearStorage(){
  ls.clear();
}
