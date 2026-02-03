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
        // db.each("SELECT * FROM puntuaciones ORDER BY puntuacion DESC LIMIT 5", (err, row) => {
        //     console.log(row.id + ": " + row.nombre + " - " + row.puntuacion)
        // });
    }
});

// MANEJADORES -- ¡¡¡IMPORTANTE ENLAZARLOS EN preload.js!!!
// GUARDAR PUNTUACIÓN
ipcMain.handle('insertar-puntuacion', async (event, datosUsuario) => {
  return new Promise((resolve, reject) => {
    const { nombre, puntuacion } = datosUsuario;
    const consulta = `INSERT INTO puntuaciones (nombre, puntuacion) VALUES (?, ?)`;
    
    db.run(consulta, [nombre, puntuacion], function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID });
    });
  });
});

// MOSTRAR PUNTUACIÓN
ipcMain.handle('mostrar-puntuaciones', async (event, datosUsuario) => {
  return new Promise((resolve, reject) => {
    const consulta = "SELECT * FROM puntuaciones ORDER BY CAST(puntuacion AS INTEGER) DESC LIMIT 5";

    // db.all devuelve un array con todos los resultados
    db.all(consulta, [], (err, rows) => {
        if (err) {
            console.error("Error en DB:", err);
            reject(err);
        } else {
            // resolve envía los datos de vuelta a Angular
            resolve(rows); 
        }
    });
  });
});

let appWin;

createWindow = () => {
    appWin = new BrowserWindow({
        width: 1024,
        height: 768,
        title: "Clicker ANGUL-ON",
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

// npm run electron - Arranca la aplicación completa, necesario para probar la BD
// ng serve - Arranca Angular en puerto 4200