var cs = require('color-scheme');
var before = 'default';
;
function changeColor(color) {
    var head = document.getElementsByClassName('navbar');
    var headButton = document.getElementsByClassName('navbar-btn');
    var fa = document.getElementsByClassName('fa');
    var fp = document.getElementById('file-panel');
    var p = document.getElementsByTagName('p');
    var h1 = document.getElementsByTagName('h1');
    var diffp = document.getElementById('diff-panel-body');
    var network = document.getElementById('my-network');
    var footer = document.getElementById('footer');
    var arp = document.getElementById('add-repository-panel');
    var auth = document.getElementById('authenticate');
    if (color === 'white') {
        for (var i = 0; i < head.length; i++) {
            head[i].className = 'navbar navbar-white';
        }
        for (var i = 0; i < headButton.length; i++) {
            if (before === 'default') {
                headButton[i].classList.remove('btn-inverse');
            }
            headButton[i].classList.add('btn-default');
        }
        for (var i = 0; i < fa.length; i++) {
            fa[i].setAttribute('style', 'color:#a8abaf');
        }
        fp.setAttribute('style', 'background-color:#E3E3E3');
        for (var i = 0; i < p.length; i++) {
            p[i].style.color = 'black';
        }
        for (var i = 0; i < h1.length; i++) {
            h1[i].style.color = '#5E5E5E';
        }
        diffp.style.color = '#D2D3D4';
        diffp.style.backgroundColor = '#616161';
        network.style.backgroundColor = '#D6D6D6';
        footer.style.backgroundColor = '#E3E3E3';
        arp.style.backgroundColor = '#D1D1D1';
        auth.style.backgroundColor = '#D6D6D6';
        before = 'white';
    }
    else if (color === 'default') {
        for (var i = 0; i < head.length; i++) {
            head[i].className = 'navbar navbar-inverse';
        }
        for (var i = 0; i < headButton.length; i++) {
            if (before === 'default') {
                headButton[i].classList.remove('btn-default');
            }
            headButton[i].classList.add('btn-inverse');
        }
        for (var i = 0; i < fa.length; i++) {
            fa[i].setAttribute('style', 'color:white');
        }
        for (var i = 0; i < h1.length; i++) {
            h1[i].style.color = '#EEF8E7';
        }
        for (var i = 0; i < h2.length; i++) {
            h2[i].style.color = '#f2f2f2';
        }
        diffp.style.color = '#fff';
        diffp.style.backgroundColor = '#282828';
        network.style.backgroundColor = '#88BDBC';
        footer.style.backgroundColor = '#112D32';
        arp.style.backgroundColor = '#254E58';
        auth.style.backgroundColor = '#88BDBC';
        before = 'blue';
    }
    else if (color === 'burgundy') {
        for (var i = 0; i < head.length; i++) {
            console.log(head[i]);
            head[i].className = 'navbar navbar-burgundy';
        }
        for (var i = 0; i < headButton.length; i++) {
            if (before === 'default') {
                headButton[i].classList.remove('btn-default');
            }
            headButton[i].classList.add('btn-inverse');
        }
        for (var i = 0; i < fa.length; i++) {
            fa[i].setAttribute('style', 'color:white');
        }
        fp.setAttribute('style', 'background-color:#572219');
        for (var i = 0; i < p.length; i++) {
            p[i].style.color = '#F4EDE9';
        }
        for (var i = 0; i < h1.length; i++) {
            h1[i].style.color = '#572219';
        }
        for (var i = 0; i < h2.length; i++) {
            h2[i].style.color = '#F4EDE9';
        }
        diffp.style.color = '#fff';
        diffp.style.backgroundColor = '#282828';
        network.style.backgroundColor = '#C9A2A3';
        footer.style.backgroundColor = '#572219';
        arp.style.backgroundColor = '#9D4B4C';
        auth.style.backgroundColor = '#C9A2A3';
        before = 'burgundy';
    }
}
