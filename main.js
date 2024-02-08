const { app, BrowserWindow, session } = require('electron');

let mainWindow;
let splashScreen;

function createSplashScreen() {
  splashScreen = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true
    }
  });

  splashScreen.loadFile('splash.html');
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false, // Hide the main window initially
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Create a new session for the main window
  const mainSession = mainWindow.webContents.session;

  // Load the PHP email application inside the main window
  mainWindow.loadURL('https://quickinbox.site/app/');

  // Attach a single did-finish-load event listener
  mainWindow.webContents.on('did-finish-load', () => {
    // Show the main window once content is loaded
    mainWindow.show();

    // Close the splash screen after content is loaded
    if (splashScreen) {
      splashScreen.close();
      splashScreen = null;
    }

    // Inspect cookies after the content is loaded and the session is established
    mainSession.cookies.get({}, (error, cookies) => {
      if (error) throw error;
      console.log('Cookies:', cookies);
    });
  });

  // Handle the window closed event
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createSplashScreen();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createSplashScreen();
    createWindow();
  }
});
