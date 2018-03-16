var github = require("octonode");
var opn = require("opn");
var username;
var password;
var aid, atoken;
var client;
var avaterImg;
var repoList = {};
var url;
function signInHead(callback) {
    username = document.getElementById("Email1").value;
    password = document.getElementById("Password1").value;
    getUserInfo(callback);
}
function signInPage(callback) {
    username = document.getElementById("username").value;
    password = document.getElementById("password").value;
    getUserInfo(callback);
}
function openForgotPassword() {
    opn('https://github.com/password_reset');
}
function getUserInfo(callback) {
    cred = Git.Cred.userpassPlaintextNew(username, password);
    client = github.client({
        username: username,
        password: password
    });
    var ghme = client.me();
    ghme.info(function (err, data, head) {
        if (err) {
            displayModal(err);
        }
        else {
            avaterImg = Object.values(data)[2];
            clearStorage();
            storeEncryptedData();
            // let doc = document.getElementById("avater");
            // doc.innerHTML = "";
            // var elem = document.createElement("img");
            // elem.width = 40;
            // elem.height = 40;
            // elem.src = avaterImg;
            // doc.appendChild(elem);
            // doc = document.getElementById("log");
            // doc.innerHTML = 'sign out';
            var doc = document.getElementById("avatar");
            doc.innerHTML = 'Sign out';
            callback();
        }
    });
    ghme.repos(function (err, data, head) {
        if (err) {
            return;
        }
        else {
            for (var i = 0; i < data.length; i++) {
                var rep = Object.values(data)[i];
                displayBranch(rep['full_name'], "repo-dropdown", "selectRepo(this)");
                repoList[rep['full_name']] = rep['html_url'];
            }
        }
    });
    // let scopes = {
    //   'add_scopes': ['user', 'repo', 'gist'],
    //   'note': 'admin script'
    // };
    //
    // github.auth.config({
    //   username: username,
    //   password: password
    // }).login(scopes, function (err, id, token) {
    //   if (err !== null) {
    //     console.log("login fail -- " + err);
    //   }
    //   aid = id;
    //   atoken = token;
    //   console.log(id, token);
    // });
}
function selectRepo(ele) {
    url = repoList[ele.innerHTML];
    var butt = document.getElementById("cloneButton");
    butt.innerHTML = 'Clone ' + ele.innerHTML;
    butt.setAttribute('class', 'btn btn-primary');
}
function storeEncryptedData() {
    var randomUUID = generateUniqueSecret();
    storeVariable('secret', randomUUID);
    var encryptedUser = encryptValue(username);
    storeUsername(encryptedUser);
    var encryptedPassword = encryptValue(password);
    storePassword(encryptedPassword);
}
function cloneRepo() {
    if (url === null) {
        updateModalText("Please enter an URL!");
        return;
    }
    var splitText = url.split(/\.|:|\//);
    var local;
    if (splitText.length >= 2) {
        local = splitText[splitText.length - 1];
    }
    downloadFunc(url, local);
    url = null;
    $('#repo-modal').modal('hide');
}
