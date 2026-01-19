const { app, BrowserWindow } = require("electron");
const { ipcMain } = require('electron');
const path = require('path');
const sqlite3 = require("sqlite3").verbose();

// https://www.youtube.com/watch?v=KiuJdCDX9vg
const db = new sqlite3.Database(path.join(__dirname, 'db/test.db'), (err) => {
    if (err) {
        console.log('FALLO Conexión DB');
    } else {
        console.log('CONECTADO sqlite3 DB!');
        // PRUEBA MOSTRAR TABLA CONSOLA
        db.each("SELECT * FROM puntuaciones", (err, row) => {
            console.log(row.id + ": " + row.nombre + " - " + row.puntuacion)
        });
    }
});

// MANEJADOR INSERCIÓN DE PUNTOS
ipcMain.handle('insertar-puntuacion', async (event, datosUsuario) => {
  return new Promise((resolve, reject) => {
    const { nombre, puntuacion } = datosUsuario;
    const query = `INSERT INTO puntuaciones (nombre, puntuacion) VALUES (?, ?)`;
    console.log("holi se están insertando datos");
    db.run(query, [nombre, puntuacion], function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID });
    });
  });
});



let appWin;

createWindow = () => {
    appWin = new BrowserWindow({
        width: 1024,
        height: 768,
        title: "Clicker ANGULON",
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Necesario especificar esta ruta del preload
            contextIsolation: true, // Debe estar en true
            nodeIntegration: false // Por seguridad, debe estar en false
        }
    });
    
    appWin.loadURL(`file://${__dirname}/dist/browser/index.html`);

    appWin.setMenu(null);

    // appWin.webContents.openDevTools();

    appWin.on("closed", () => {
        appWin = null;
    });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
});

// npm run electron