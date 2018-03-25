let github = require("octonode");
let opn = require("opn");
let username;
let password;
let aid, atoken;
let client;
let avatarImg;
let tfa;
let repoList = {};
let url;
let fs = require("fs");

function signInHead(callback) {
  username = (<HTMLInputElement>document.getElementById("Email1")).value;
  password = (<HTMLInputElement>document.getElementById("Password1")).value;
  tfa = (<HTMLInputElement>document.getElementById("tfa-code")).value;
  getUserInfo(callback);
}

function signOut() {
  username = null;
  password = null;
  aid = null;
  atoken = null;
  displayModal("You can revoke your Personal Access Token now");
  setTimeout(e => window.location.reload(), 5000);
}

function signInPage(callback) {
  username = (<HTMLInputElement>document.getElementById("username")).value;
  password = (<HTMLInputElement>document.getElementById("password")).value;
  tfa = (<HTMLInputElement>document.getElementById("tfa-code")).value;
  getUserInfo(callback);
}

function openForgotPassword(){
  opn('https://github.com/password_reset');
}

function getUserInfo(callback) {
  cred = Git.Cred.userpassPlaintextNew(username, password);

  let scopes = {
    'scopes': ['user', 'repo', 'gist'],
    'note': generateUniqueSecret()
  };

  if (tfa) {
    getTFAToken(username, password, tfa, scopes).then(token => {
      atoken = token;
      doLogin(username, token, callback);
    }, error => {
      displayModal(error);
    });
  } else {
    doLogin(username, password, callback);
  }

}

function getTFAToken(uname: string, pass: string, tfa: string, scopes: object) : Promise<any> {
  var config = {
    username: uname,
    password: pass,
    otp: tfa
  };
  return new Promise(((resolve, reject) => {
    github.auth.config(config).login(scopes, (err, id, token, headers) => {
      if (err) reject(err);
      resolve(token);
    });
  }));
}

function doLogin(username: string, password: string, callback: Function) {

  client = github.client({
    username: username,
    password: password
  });
  var ghme = client.me();
  ghme.info(function(err, data, head) {
    if (err) {
      displayModal(err);
    } else {
      avatarImg = Object.values(data)[2];
      clearStorage();
      storeEncryptedData(username, password);
      let doc = <HTMLElement>document.getElementById("avatar");
      doc.innerHTML = 'Sign out';
      let usernameTitle = <HTMLElement>document.getElementById("usernameTitle");
      if (username != "") {
        usernameTitle.innerHTML = username;
      }
      callback();
    }
  });

  ghme.repos(function(err, data, head) {
    if (err) {
      return;
    } else {
      for (let i = 0; i < data.length; i++) {
        let rep = Object.values(data)[i];
        displayBranch(rep['full_name'], "repo-dropdown", "selectRepo(this)");
        repoList[rep['full_name']] = rep['html_url'];
      }
    }
  });

}

function selectRepo(ele) {
  url = repoList[ele.innerHTML];
  let butt = <HTMLElement>document.getElementById("cloneButton");
  butt.innerHTML = 'Clone ' + ele.innerHTML;
  butt.setAttribute('class', 'btn btn-primary');
}

function storeEncryptedData(uname: string, pass: string){
  let randomUUID = generateUniqueSecret();
  storeVariable('secret', randomUUID);
  let encryptedUser = encryptValue(uname);
  storeUsername(encryptedUser);
  let encryptedPassword = encryptValue(pass);
  storePassword(encryptedPassword);
}

function cloneRepo() {
  if (url === null) {
    updateModalText("Please enter an URL!");
    return;
  }
  let fullPath = document.getElementById("repoCloneLocation").files[0].path
  setStashList(new Map());
  let splitText = url.split(/\.|:|\//);
  let local;
  if (splitText.length >= 2) {
    local = splitText[splitText.length - 1];
  }
  downloadFunc(url, local, fullPath);
  url = null;
  $('#repo-modal').modal('hide');
}
