/**
 * Created by Yunzhe on 2018/10/19.
 */

'use strict';
const url = require('url');
const {app, BrowserWindow, Menu} = require('electron');
const {default: installExtension, VUEJS_DEVTOOLS} = require('electron-devtools-installer');

const isProduction = process.env.NODE_ENV === 'production';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow () {

    // 创建浏览器窗口。
    win = new BrowserWindow({
        width: 1050,
        height: 660,
        autoHideMenuBar: true,
        backgroundColor: '#d1382a',
    });

    // 然后加载应用的 index.html。
    if (isProduction) {
        // 生产环境下应该打开test.anisong.online
        win.loadURL(url.format({
            protocol: 'https',
            hostname: 'test.anisong.online',
            slashes: true,
        }));
        win.setMenu(null);
    } else {
        win.loadURL(url.format({
            protocol: 'http',
            hostname: 'localhost',
            port: '8080',
            slashes: true,
        }));

        // 打开开发者工具
        win.webContents.openDevTools();

        const template = [{
            label: 'Window',
            submenu: [
                {role: 'reload', accelerator: 'F5'},
                {role: 'forcereload', accelerator: 'F6'},
                {role: 'toggledevtools', accelerator: 'F12'},
                {role: 'togglefullscreen', accelerator: 'F10'},
                {role: 'quit', accelerator: 'Esc'},
            ],
        }];

        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);

        installExtension(VUEJS_DEVTOOLS).then(
            name => console.log(`Added Extension:  ${name}`),
        ).catch(
            err => console.log('An error occurred: ', err),
        );
    }

    // 当 window 被关闭，这个事件会被触发。
    win.on('closed', () => {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 与此同时，你应该删除相应的元素。
        win = null;
    });

}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow);

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (win === null) {
        createWindow();
    }
});