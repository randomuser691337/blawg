// Function to open or create the IndexedDB database
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('guideDB', 1);

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            db.createObjectStore('variables', { keyPath: 'name' });
        };

        request.onsuccess = function (event) {
            const db = event.target.result;
            resolve(db);
        };

        request.onerror = function (event) {
            reject(event.target.error);
        };
    });
}

// Function to write a variable to the database
function writeVar(name, value) {
    openDatabase().then(db => {
        const transaction = db.transaction(['variables'], 'readwrite');
        const objectStore = transaction.objectStore('variables');

        const request = objectStore.put({ name, value });

        request.onsuccess = function () {
            console.log(`Variable ${name} written to the database.`);
        };

        request.onerror = function (event) {
            console.error('Error writing variable to the database:', event.target.error);
        };
    }).catch(error => {
        console.error('Error opening database:', error);
    });
}

// Function to read a variable from the database
function readVar(name) {
    return new Promise((resolve, reject) => {
        openDatabase().then(db => {
            const transaction = db.transaction(['variables'], 'readonly');
            const objectStore = transaction.objectStore('variables');

            const request = objectStore.get(name);

            request.onsuccess = function () {
                const variable = request.result;
                if (variable) {
                    resolve(variable.value);
                } else {
                    reject(`Variable ${name} not found in the database.`);
                }
            };

            request.onerror = function (event) {
                reject(`Error reading variable from the database: ${event.target.error}`);
            };
        }).catch(error => {
            reject(`Error opening database: ${error}`);
        });
    });
}

// Function to set CSS variable values
function setCSSVariable(name, value) {
    document.documentElement.style.setProperty(`--${name}`, value);
}

// Function to initialize the application
function initializeApp() {
    readVar('accent').then(accentValue => {
        setCSSVariable('accent', accentValue);
    }).catch(error => {
        console.error(error);
    });

    // Restore lightdark variable from the database and set CSS variable
    readVar('lightdark').then(lightdarkValue => {
        if (lightdarkValue === "dark" || lightdarkValue === undefined || lightdarkValue === null) {
            dark();
        } else {
            light();
        }
    }).catch(error => {
        console.error(error);
    });
}

document.addEventListener('DOMContentLoaded', initializeApp);
let timego = false;
function showTime() {
    const t = document.getElementById("tbclock");
    if (t) {
        if (timego == !true) {
            showTime2();
            setInterval(showTime2, 1000);
        }
        timego = true;
    } else {
        console.log('oops time shat itself; fix it pls');
    }
}

function showTime2() {
    let time = new Date();
    let hour = time.getHours();
    let min = time.getMinutes();
    let sec = time.getSeconds();
    am_pm = " AM";
    if (hour >= 12) { if (hour > 12) hour -= 12; am_pm = " PM"; } else if (hour == 0) { hr = 12; am_pm = " AM"; }
    hour = hour < 10 ? "0" + hour : hour;
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;
    let currentTime = hour + ":" + min + ":" + sec + am_pm;
    document.getElementById("tbclock").innerHTML = currentTime;
}

showTime();

function doc(url, name) {
    main(url);
    document.getElementById('ok').style.display = "none";
    document.getElementById('ok2').style.display = "inline";
    document.getElementById('docn').textContent = name;
}
function docold(url, name) {
    hideshow('content', 'reader2');
    document.getElementById('reader2').src = url;
    document.getElementById('ok').style.display = "none";
    document.getElementById('ok2').style.display = "inline";
    document.getElementById('docn').textContent = name;
}
function fuck() {
    document.getElementById('ok2').style.display = "none";
    document.getElementById('ok').style.display = "inline";
    document.getElementById('docn').textContent = 'Docs';
    hideshow('reader', 'content');
    hideshow('reader2', 'content');
}
// Reader 2.0
function main(path) {
    hideshow('content', 'reader');
    hideshow('reader2', 'reader');
    const divElement = document.getElementById('reader');
    // Pathreader won't read local files when running locally.
    // If you have any fixes for this, DM me on Discord: @randomuser691337
    fetch(path)
        .then(response => response.text())
        .then(data => {
            divElement.innerHTML = data;
        })
        .catch(error => {
            divElement.innerHTML = `<p>Error loading file: ${error}</p><p>This usually happens if WebDesk is running locally. If not, debugging:</p>
                        <li>Are you connected to the Internet?</li><li>Is my read() statement's URL correct and available?</li>
                        <li>Does the file have cross-site/CORS restrictions?</li>
                        <a onclick="window.location.reload();">If not, click here to attempt to load the document again.</a>`;
        });
}
function hideshow(d1, d2) {
    document.getElementById(d1).style.display = "none";
    document.getElementById(d2).style.display = "block";
}
let mybutton = document.getElementById("jump");
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function changeColor(color) {
    document.documentElement.style.setProperty('--accent', color);
    writeVar('accent', color);
}
function light() {
    document.documentElement.style.setProperty('--lightdark', "#ffffff");
    document.documentElement.style.setProperty('--lightdark2', "#efefef");
    document.documentElement.style.setProperty('--lightdarkp', "#dfdfdf");
    document.documentElement.style.setProperty('--font', "#000");
    document.documentElement.style.setProperty('--d', "#666");
    writeVar('lightdark', 'light');

}
function dark() {
    document.documentElement.style.setProperty('--lightdark', "#1a1a1a");
    document.documentElement.style.setProperty('--lightdark2', "#2a2a2a");
    document.documentElement.style.setProperty('--lightdarkp', "#000000");
    document.documentElement.style.setProperty('--font', "#ffffff");
    document.documentElement.style.setProperty('--d', "#ddd");
    writeVar('lightdark', 'dark');
}