let github = require("octonode");
let opn = require("opn");
let username;
let password;
let aid, atoken;
let client;
let avatarImg;
let otp;
let repoList = {};
let url;
let fs = require("fs");

function authpage_onload() {
  fs.readFile("./cred.txt", "UTF-8", (error, data) => {
    if (error) {
      console.log(error);
      return;
    }
    console.log(data);
    username = data.split(":")[0];
    password = atoken = data.split(":")[1];
    (<HTMLInputElement>document.getElementById("username")).value = username;
    (<HTMLInputElement>document.getElementById("password")).value = atoken;
  });
}

function signInHead(callback) {
  username = (<HTMLInputElement>document.getElementById("Email1")).value;
  password = (<HTMLInputElement>document.getElementById("Password1")).value;
  otp = (<HTMLInputElement>document.getElementById("tfa-code")).value;
  console.log(username + '      ' + password);
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
  otp = (<HTMLInputElement>document.getElementById("tfa-code")).value;
  getUserInfo(callback);
}

function openForgotPassword(){
  opn('https://github.com/password_reset');
}

// UUIDv4 generator by jed - https://gist.github.com/jed/982883
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

function getUserInfo(callback) {
  cred = Git.Cred.userpassPlaintextNew(username, password);

  let scopes = {
    'scopes': ['user', 'repo', 'gist'],
    'note': uuidv4()
  };

  if (!atoken && atoken === password) {
    loginPromise(username, password, otp, scopes).then(token => {
      atoken = token;
      fs.writeFile("./cred.txt",username+":"+token,0,"UTF-8");
      doLogin(username, token, callback);
    }, error => {
      displayModal(error);
    });
  } else {
    doLogin(username, atoken, callback);
  }

}

function loginPromise(uname: string, pass: string, tfa: string, scopes: object) : Promise<any> {
  var config = (tfa) ? {
    username: uname,
    password: pass,
    otp: tfa
  } : {
    username : uname,
    password: pass
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
      avatarImg = Object.values(data)[2]
      // let doc = document.getElementById("avatar");
      // doc.innerHTML = "";
      // var elem = document.createElement("img");
      // elem.width = 40;
      // elem.height = 40;
      // elem.src = avatarImg;
      // doc.appendChild(elem);
      // doc = document.getElementById("log");
      // doc.innerHTML = 'sign out';
      let doc = <HTMLElement>document.getElementById("avatar");
      doc.innerHTML = 'Sign out';
      callback();
    }
  });

  ghme.repos(function(err, data, head) {
    if (err) {
      return;
    } else {
      console.log(data.length);
      for (let i = 0; i < data.length; i++) {
        let rep = Object.values(data)[i];
        console.log(rep['html_url']);
        displayBranch(rep['name'], "repo-dropdown", "selectRepo(this)");
        repoList[rep['name']] = rep['html_url'];
      }
    }
  });

}

function selectRepo(ele) {
  url = repoList[ele.innerHTML];
  let butt = <HTMLElement>document.getElementById("cloneButton");
  butt.innerHTML = 'Clone ' + ele.innerHTML;
  butt.setAttribute('class', 'btn btn-primary');
  console.log(url + 'JJJJJJJJ' + ele.innerHTML);
}

function cloneRepo() {
  if (url === null) {
    updateModalText("Ops! Error occors");
    return;
  }
  let splitText = url.split(/\.|:|\//);
  let local;
  if (splitText.length >= 2) {
    local = splitText[splitText.length - 1];
  }
  downloadFunc(url, local);
  url = null;
  $('#repo-modal').modal('hide');
}
