let cs = require('color-scheme');
let before = 'default';;
function changeColor(color) {
    let head = document.getElementsByClassName('navbar');
    let headButton = document.getElementsByClassName('navbar-btn');
    let fa = document.getElementsByClassName('fa');
    let fp = document.getElementById('file-panel');
    let p = document.getElementsByTagName('p');
    let h1 = document.getElementsByTagName('h1');
    let h2 = document.getElementsByTagName('h2');
    let diffp = document.getElementById('diff-panel-body');
    let network = document.getElementById('my-network');
    let footer = document.getElementById('footer');
    let arp = document.getElementById('add-repository-panel');
    let auth = document.getElementById('authenticate');
    if (color === 'white') {
        for (let i = 0; i < head.length; i++) {
            head[i].className = 'navbar navbar-white';
        }
        for (let i = 0; i < headButton.length; i++) {
            if (before === 'default') {
                headButton[i].classList.remove('btn-inverse');
            }
            headButton[i].classList.add('btn-default');
        }
        for (let i = 0; i < fa.length; i++) {
            fa[i].setAttribute('style', 'color:#a8abaf');
        }
        fp.setAttribute('style', 'background-color:#E3E3E3');
        for (let i = 0; i < p.length; i++) {
            p[i].style.color = 'black';
        }
        for (let i = 0; i < h1.length; i++) {
            h1[i].style.color = '#5E5E5E';
        }
        for (let i = 0; i < h2.length; i++) {
            h2[i].style.color = '#5E5E5E';
        }
        diffp.style.color = '#D2D3D4';
        diffp.style.backgroundColor = '#616161';
        network.style.backgroundColor = '#D6D6D6';
        footer.style.backgroundColor = '#E3E3E3';
        arp.style.backgroundColor = '#D1D1D1';
        auth.style.backgroundColor = '#D6D6D6';
        before = 'white';
    } else if (color === 'default') {
        for (let i = 0; i < head.length; i++) {
            head[i].className = 'navbar navbar-inverse';
        }
        for (let i = 0; i < headButton.length; i++) {
            if (before === 'default') {
                headButton[i].classList.remove('btn-default');
            }
            headButton[i].classList.add('btn-inverse');
        }
        for (let i = 0; i < fa.length; i++) {
            fa[i].setAttribute('style', 'color:white');
        }
        fp.setAttribute('style', 'background-color:#282828');
        for (let i = 0; i < p.length; i++) {
            p[i].style.color = '#ccc';
        }
        for (let i = 0; i < h1.length; i++) {
            h1[i].style.color = '#ccc';
        }
        for (let i = 0; i < h2.length; i++) {
            h2[i].style.color = '#ccc';
        }
        diffp.style.color = '#fff';
        diffp.style.backgroundColor = '#282828';
        network.style.backgroundColor = '#181818';
        footer.style.backgroundColor = '#282828';
        arp.style.backgroundColor = '#282828';
        auth.style.backgroundColor = '#282828';
        before = 'default';
    } else if (color === 'vintage') {
        for (let i = 0; i < head.length; i++) {
            head[i].className = 'navbar navbar-vintage';
        }
        for (let i = 0; i < headButton.length; i++) {
            if (before === 'default') {
                headButton[i].classList.remove('btn-default');
            }
            headButton[i].classList.add('btn-inverse');
        }
        for (let i = 0; i < fa.length; i++) {
            fa[i].setAttribute('style', 'color:white');
        }
        fp.setAttribute('style', 'background-color:#212617');
        for (let i = 0; i < p.length; i++) {
            p[i].style.color = '#E9E7DA';
        }
        for (let i = 0; i < h1.length; i++) {
            h1[i].style.color = '#373F27';
        }
        for (let i = 0; i < h2.length; i++) {
            h2[i].style.color = '#E9E7DA';
        }

        diffp.style.color = '#fff'
        diffp.style.backgroundColor = '#282828';
        network.style.backgroundColor = '#E9E7DA';
        footer.style.backgroundColor = '#212617';
        arp.style.backgroundColor = '#3d422a';
        auth.style.backgroundColor = '#E9E7DA';
        before = 'vintage';
    } else if (color === 'blue') {
        for (let i = 0; i < head.length; i++) {
            head[i].className = 'navbar navbar-blue';
        }
        for (let i = 0; i < headButton.length; i++) {
            if (before === 'default') {
                headButton[i].classList.remove('btn-default');
            }
            headButton[i].classList.add('btn-inverse');
        }
        for (let i = 0; i < fa.length; i++) {
            fa[i].setAttribute('style', 'color:white');
        }
        fp.setAttribute('style', 'background-color:#112D32');
        for (let i = 0; i < p.length; i++) {
            p[i].style.color = '#EAE7DC';
        }

        for (let i = 0; i < h1.length; i++) {
            h1[i].style.color = '#EEF8E7';
        }
        for (let i = 0; i < h2.length; i++) {
            h2[i].style.color = '#f2f2f2';
        }

        diffp.style.color = '#fff'
        diffp.style.backgroundColor = '#282828';
        network.style.backgroundColor = '#88BDBC';
        footer.style.backgroundColor = '#112D32';
        arp.style.backgroundColor = '#254E58';
        auth.style.backgroundColor = '#88BDBC';
        before = 'blue';
    } else if (color === 'burgundy') {
        for (let i = 0; i < head.length; i++) {
            head[i].className = 'navbar navbar-burgundy';
        }
        for (let i = 0; i < headButton.length; i++) {
            if (before === 'default') {
                headButton[i].classList.remove('btn-default');
            }
            headButton[i].classList.add('btn-inverse');
        }
        for (let i = 0; i < fa.length; i++) {
            fa[i].setAttribute('style', 'color:white');
        }
        fp.setAttribute('style', 'background-color:#572219');
        for (let i = 0; i < p.length; i++) {
            p[i].style.color = '#F4EDE9';
        }
        for (let i = 0; i < h1.length; i++) {
            h1[i].style.color = '#572219';
        }
        for (let i = 0; i < h2.length; i++) {
            h2[i].style.color = '#F4EDE9';
        }
        diffp.style.color = '#fff'
        diffp.style.backgroundColor = '#282828';
        network.style.backgroundColor = '#C9A2A3';
        footer.style.backgroundColor = '#572219';
        arp.style.backgroundColor = '#9D4B4C';
        auth.style.backgroundColor = '#C9A2A3';
        before = 'burgundy';
    }
    sessionStorage.setItem("currColor", color)
}
