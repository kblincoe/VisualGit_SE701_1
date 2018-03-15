import { Component, AfterViewInit } from "@angular/core";


@Component({
  selector: "user-auth",
  template: `
    <div class="authenticate" id="authenticate">
      <nav class="navbar navbar-inverse" role="navigation">
        <div class="container-fluid">
          <button class="btn btn-inverse dropdown-toggle btn-sm navbar-btn" id="color-scheme" data-toggle="dropdown">
            color
            <span class="caret"></span>
          </button>
          <ul class="dropdown-menu" id="color-dropdown" role="menu" aria-labelledby="branch-name">
            <li class="white" onclick="changeColor('white')">white</li>
            <li class="vintage" onclick="changeColor('vintage')">vintage</li>
            <li class="blue" onclick="changeColor('blue')">blue</li>
            <li class="burgundy" onclick="changeColor('burgundy')">burgundy</li>
            <li class="default" onclick="changeColor('default')">default</li>
          </ul>
        </div>
      </nav>
      <form role="form" style="text-align:center; margin-top:100px">
        <label>
          <h1>VisualGit</h1>
        </label>
        <br><br>
        <div class="input-group" style="width:280px;">
          <input id="username" class="form-control" placeholder="username" aria-describedby="basic-addon1">
        </div>
        <br>

        <div class="input-group" style="width:280px;">
          <input id="password" type="password" class="form-control" placeholder="password" aria-describedby="basic-addon1">
        </div>
        <br>

        <div class="input-group" style="width:280px;">
            <input id="tfa-code" class="form-control" placeholder="2fa code" aria-describedby="basic-addon1">
        </div>
        <br>
        <div>
          <button type="submit" style="width:280px;" class="btn btn-success" (click)="switchToMainPanel()">Sign In</button>
        </div>
        <br>
        <button type="submit" style="width:280px;" class="btn btn-primary" onclick="switchToMainPanel()">Continue without sign in</button>
        <br>
        <a class="forgot-password" onClick="openForgotPassword()" href="#">Forgot Password</a>
      </form>
    </div>
  `
})

export class AuthenticateComponent implements AfterViewInit {
  switchToMainPanel(): void {
    signInPage(switchToMainPanel);
  }

  ngAfterViewInit() {
    let username = getUsername();
    if (username != null) {
      let uncryptedData = decryptValue(username);
      let usernameField : HTMLInputElement = document.getElementById('username');
      usernameField.value = uncryptedData.toString(CryptoJS.enc.Utf8);
    }
    let password = getPassword();
    if (password != null) {
      let uncryptedData = decryptValue(password);
      let passwordField : HTMLInputElement = document.getElementById('password');
      passwordField.value = uncryptedData.toString(CryptoJS.enc.Utf8);
    }
    // This apply theme after logging out
    let currColor = sessionStorage.getItem("currColor");
    if (currColor != null) {
      changeColor(currColor);
    }
  }
}
