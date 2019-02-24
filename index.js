const electron = require('electron');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        title: 'Meus Todos',
    });
    mainWindow.loadURL(`file://${ __dirname }/main.html`);
    mainWindow.on('close', () => app.quit());

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
    addWindow = new BrowserWindow({
        title: 'Add New ToDo',
        width: 300,
        height: 200,
    });
    addWindow.loadURL(`file://${ __dirname }/add.html`);
    addWindow.on('closed', () => addWindow = null);
}

function clearAllTodos() {
    mainWindow.webContents.send('todo:clear');
}

ipcMain.on('todo:add', (event, todo) => {
    mainWindow.webContents.send('todo:add', todo);
    addWindow.close();
});

const menuTemplate = [
    {
        label: 'File',
        submenu: [
            { 
                label: 'Add ToDo',
                accelerator: 'F2',
                click: () => createAddWindow(),
            },
            {
                label: 'Clear ToDos',
                accelerator: 'F3',
                click: () => clearAllTodos(),
            },
            { 
                label: 'Quit',
                accelerator: (() => {
                    if (process.platform === 'darwin') {
                        return 'Command+Q';
                    }

                    return 'Ctrl+Q';
                })(),
                click() {
                    app.quit()
                }
            }
        ]
    }
];

if (process.platform === 'darwin') {
    menuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: 'Developer',
        submenu: [
            {
                label: 'Toggle developer tools',
                accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
                click: (item, focusedWindow) => focusedWindow.toggleDevTools()
            },
            {
                role: 'reload'
                //Quais os outros roles exitem? Pesquisar                
            }
        ]
    });
}