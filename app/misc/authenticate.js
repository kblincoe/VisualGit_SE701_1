var github = require("octonode");
var opn = require("opn");
var username;
var password;
var aid, atoken;
var client;
var avatarImg;
var tfa;
var repoList = {};
var url;
var fs = require("fs");
function signInHead(callback) {
    username = document.getElementById("Email1").value;
    password = document.getElementById("Password1").value;
    tfa = document.getElementById("tfa-code").value;
    getUserInfo(callback);
}
function signOut() {
    username = null;
    password = null;
    aid = null;
    atoken = null;
    displayModal("You can revoke your Personal Access Token now");
    setTimeout(function (e) { return window.location.reload(); }, 5000);
}
function signInPage(callback) {
    username = document.getElementById("username").value;
    password = document.getElementById("password").value;
    tfa = document.getElementById("tfa-code").value;
    getUserInfo(callback);
}
function openForgotPassword() {
    opn('https://github.com/password_reset');
}
function getUserInfo(callback) {
    cred = Git.Cred.userpassPlaintextNew(username, password);
    var scopes = {
        'scopes': ['user', 'repo', 'gist'],
        'note': generateUniqueSecret()
    };
    if (tfa) {
        getTFAToken(username, password, tfa, scopes).then(function (token) {
            atoken = token;
            doLogin(username, token, callback);
        }, function (error) {
            displayModal(error);
        });
    }
    else {
        doLogin(username, password, callback);
    }
}
function getTFAToken(uname, pass, tfa, scopes) {
    var config = {
        username: uname,
        password: pass,
        otp: tfa
    };
    return new Promise((function (resolve, reject) {
        github.auth.config(config).login(scopes, function (err, id, token, headers) {
            if (err)
                reject(err);
            resolve(token);
        });
    }));
}
function doLogin(username, password, callback) {
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
            avatarImg = Object.values(data)[2];
            clearStorage();
            storeEncryptedData(username, password);
            var doc = document.getElementById("avatar");
            doc.innerHTML = 'Sign out';
            var usernameTitle = document.getElementById("usernameTitle");
            if (username != "") {
                usernameTitle.innerHTML = username;
            }
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
}
function selectRepo(ele) {
    url = repoList[ele.innerHTML];
    var butt = document.getElementById("cloneButton");
    butt.innerHTML = 'Clone ' + ele.innerHTML;
    butt.setAttribute('class', 'btn btn-primary');
}
function storeEncryptedData(uname, pass) {
    var randomUUID = generateUniqueSecret();
    storeVariable('secret', randomUUID);
    var encryptedUser = encryptValue(uname);
    storeUsername(encryptedUser);
    var encryptedPassword = encryptValue(pass);
    storePassword(encryptedPassword);
}
function cloneRepo() {
    if (url === null) {
        updateModalText("Please enter an URL!");
        return;
    }
    var fullPath = document.getElementById("repoCloneLocation").files[0].path;
    setStashList(new Map());
    var splitText = url.split(/\.|:|\//);
    var local;
    if (splitText.length >= 2) {
        local = splitText[splitText.length - 1];
    }
    downloadFunc(url, local, fullPath);
    url = null;
    $('#repo-modal').modal('hide');
}
