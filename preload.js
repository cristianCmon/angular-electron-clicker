const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  insertarPuntuacion: (datos) => ipcRenderer.invoke('insertar-puntuacion', datos)
});