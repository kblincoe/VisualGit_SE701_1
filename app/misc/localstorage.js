var ls = require('local-storage');
function storeUsername(username) {
    storeVariable('username', username);
}
function getUsername() {
    return getVariable('username');
}
function storeVariable(name, value) {
    ls.set(name, value);
}
function getVariable(name) {
    return ls.get(name);
}
function storePassword(password) {
    storeVariable('password', password);
}
function getPassword() {
    return getVariable('password');
}
function getStashList() {
    return new Map(JSON.parse(ls.get("stashList")));
}
function setStashList(updatedStashList) {
    ls.set("stashList", JSON.stringify(updatedStashList));
}
function clearStorage() {
    ls.clear();
}
