const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

let window = null

app.once('ready', () => {
  window = new BrowserWindow({
    width: 450,
    height: 550,
    show: false,
    resizable: false
  });

  window.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  window.once('ready-to-show', () => {
    window.show()
  });
});
