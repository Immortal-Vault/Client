import { app, BrowserWindow, ipcMain } from 'electron'
import log from 'electron-log/main'
import semver from 'semver'
import { CHANNELS } from './shared/constants'
import { downloadFile, runExe } from './utils'
import * as path from 'node:path'

log.info('\n\nImmortal Vault Client starting...')

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit()
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 600,
    resizable: false,
    darkTheme: true,
    center: true,
    hasShadow: false,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: false,
      nodeIntegration: true,
    },
  })
  mainWindow.setMenu(null)

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  if (process.env.NODE_ENV != 'production') {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
    callback({ requestHeaders: { Origin: '*', ...details.requestHeaders } })
  })

  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        'Access-Control-Allow-Origin': ['*'],
        ...details.responseHeaders,
      },
    })
  })

  log.info('SignUp window created')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.on(CHANNELS.NEW_UPDATE, async (event, arg) => {
  log.info('Attempt to find latest update')

  const response = await fetch(`${process.env.API_SERVER_URL}/client-version`, {
    method: 'GET',
  })

  if (!response.ok) {
    event.sender.send(CHANNELS.NEW_UPDATE, { available: false })
    return
  }

  const jsonResponse = await response.json()
  const latestClientVersion = jsonResponse.version
  const downloadUrl = jsonResponse.downloadUrl

  if (!semver.gt(latestClientVersion, app.getVersion())) {
    event.sender.send(CHANNELS.NEW_UPDATE, { available: false })
    return
  }

  log.info(`Update ${latestClientVersion} found`)
  event.sender.send(CHANNELS.NEW_UPDATE, {
    available: true,
    version: latestClientVersion,
    downloadUrl,
  })
})

ipcMain.on(CHANNELS.TRIGGER_UPDATE, async (event, downloadUrl) => {
  log.info('Update download triggered')

  const outputPath = path.join(process.env.APPDATA, 'Immortal Vault', 'Setup')
  const fileName = downloadUrl.split('/').pop()

  const result = await downloadFile(downloadUrl, outputPath, fileName)

  if (result) {
    const exePath = path.join(outputPath, fileName)
    await runExe(exePath)
  }
})

log.info(`Immortal Vault Client ${app.getVersion()} started successfully`)
