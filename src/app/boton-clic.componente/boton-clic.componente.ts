import { Component, signal, ChangeDetectorRef } from "@angular/core";
import { ServicioSqlite3 } from "../../servicios/servicioSqlite3";

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
    constructor(private servicioSqlite: ServicioSqlite3, private cd: ChangeDetectorRef) {}

    textoBoton = '¡Clica!';
    contador = 0;
    contadorSignal = signal(0);
    mensajeInicial = 'Púlsame para jugar';
    empezarCuenta = true;
    finPartida = false;

    timer = 20; // Valor inicial timer
    intervalo: any;


    aumentarContador(valor: number) {
        if (!this.finPartida) {
            if (this.empezarCuenta) {
                this.textoBoton = this.timer.toString(10);
                this.iniciarContadorDescendente();
                this.empezarCuenta = false;
            }

            this.contador += valor;
            this.contadorSignal.update((actual) => actual + valor);
    
            const sonidoClick = new Audio('../../public/SANWA OBSF.mp3');
            sonidoClick.play();
            // Opcional: Eliminar el audio después de reproducido para limpiar memoria
            sonidoClick.addEventListener('ended', () => {
                sonidoClick.remove();
            });
        } else {
            // implementar sonido alerta
        }
    }

    verPuntuaciones() {
        // MOSTRAR MODAL
        console.log('botón puntuaciones pulsado');
    }

    async guardarPuntuacion() {
        try { // Implementación de prueba
            const resultado = await this.servicioSqlite.addPuntuacion('John Doe', this.contador.toString());
            console.log('Puntuación insertada con ID: ', resultado.id);
        } catch (error) {
            console.error('Error al insertar puntuación: ', error);
        }
    }

    // Para un contador que se detiene al llegar a cero
    iniciarContadorDescendente() {
        let tiempoRestanteMs = this.timer * 1000;
        // Usamos setInterval para ejecutar la función cada segundo (1000ms)
        this.intervalo = setInterval(() => {
            if (tiempoRestanteMs > 0) {
                tiempoRestanteMs -= 10;
                // this.timer--;
                // this.textoBoton = this.timer.toString(10);
                this.textoBoton = this.formatearTiempo(tiempoRestanteMs);
                // console.log(this.textoBoton);
                this.cd.detectChanges();
            } else {
                clearInterval(this.intervalo); // Detiene el intervalo cuando llega a cero
                this.textoBoton = "¡Tiempo!";
                this.finPartida = true;
                this.cd.detectChanges();
                // TODO MOSTRAR MODAL INSERTAR PUNTUACIÓN guardarPuntuacion()
            }
        }, 10); //1000 para 1seg, 10 para precisión de centésimas
    }

    formatearTiempo(ms: number): string {
        const segundos = Math.floor(ms / 1000);
        const milisegundos = Math.floor((ms % 1000) / 10); // Obtenemos 2 dígitos
        
        // padStart asegura que siempre haya dos dígitos
        return `${segundos.toString().padStart(2, '0')}.${milisegundos.toString().padStart(2, '0')}`;
    }


}
// https://www.youtube.com/watch?v=6wD-xcQ_1a8&list=PLCKuOXG0bPi3cfoQcSTaGUnqZbzLA30Hi&index=8