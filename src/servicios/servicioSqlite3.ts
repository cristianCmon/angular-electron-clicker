import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ServicioSqlite3 {
  async addPuntuacion(nombre: string, puntuacion: string) {
    // Accedemos al objeto expuesto en el preload
    return await (window as any).electronAPI.insertarPuntuacion({ nombre, puntuacion });
  }
}