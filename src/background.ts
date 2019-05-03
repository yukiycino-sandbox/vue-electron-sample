import { app, protocol, BrowserWindow, ipcMain, Event } from "electron"
import { createProtocol, installVueDevtools } from "vue-cli-plugin-electron-builder/lib"
import auth from "oauth-electron-twitter"

let info = {
  key: "xxxxxxxxxxxxxxxxxxxxxxxxx",
  secret: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}

const isDevelopment = process.env.NODE_ENV !== "production"

let win: BrowserWindow | null

protocol.registerSchemesAsPrivileged([{ scheme: "app", privileges: { secure: true } }])

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol("app")
    win.loadURL("app://./index.html")
  }

  win.on("closed", () => {
    win = null
  })
}

const loginDialog = async (event: Event) => {
  const authWindow = new BrowserWindow({ webPreferences: { nodeIntegration: false } })

  try {
    const result = await auth.login(info, authWindow)
    console.log(result)
    event.sender.send("loginSuccess", result.token, result.tokenSecret)
  } catch (error) {
    console.error(error)
  }

  authWindow.close()
  return
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  if (win === null) {
    createWindow()
  }
})

app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installVueDevtools()
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString())
    }
  }
  createWindow()
})

ipcMain.on("loginDialog", (e: Event) => {
  loginDialog(e)
})

if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit()
      }
    })
  } else {
    process.on("SIGTERM", () => {
      app.quit()
    })
  }
}
