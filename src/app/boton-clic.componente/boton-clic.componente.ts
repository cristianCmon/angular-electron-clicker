import { Component, signal } from "@angular/core";
import { ServicioSqlite3 } from "../../servicios/servicioSqlite3"

@Component({
    // template: `
    // <h1>Hola Mundo - Contador de clics</h1>
    // <h2>Clics: {{contador}}</h2>
    // <button (click)="aumentarContador()">Clícame</button>
    // <button (click)="reiniciarContador()">Reiniciar</button>
    // `,
    // styles: `
    //     h2 {
    //         color: red;
    //     }
    // `,
    templateUrl: './boton-clic.componente.html',
    styleUrl: './boton-clic.componente.css'
})
export class BotonClicComponente {
    constructor(private servicioSqlite: ServicioSqlite3) {}
    contador = 0;
    contadorSignal = signal(0);
    mensajeInicial = 'Púlsame para jugar';

    aumentarContador(valor: number) {
        // if (this.contador == 0) {
        //     this.contador = this.mensajeInicial;
        // }
        this.contador += valor;
        this.contadorSignal.update((actual) => actual + valor);

        const sonidoClick = new Audio('../../public/SANWA OBSF.mp3');
        sonidoClick.play();
        // Opcional: Eliminar el audio después de reproducido para limpiar memoria
        sonidoClick.addEventListener('ended', () => {
            sonidoClick.remove();
        });
    }

    reiniciarContador() {
        this.contador = 0;
        this.contadorSignal.set(0);
    }

    async guardarPuntuacion() {
        try { // Implementación de prueba
            const resultado = await this.servicioSqlite.addPuntuacion('John Doe', this.contador.toString());
            console.log('Puntuación insertada con ID: ', resultado.id);
        } catch (error) {
            console.error('Error al insertar puntuación: ', error);
        }
    }
}
// https://www.youtube.com/watch?v=6wD-xcQ_1a8&list=PLCKuOXG0bPi3cfoQcSTaGUnqZbzLA30Hi&index=8