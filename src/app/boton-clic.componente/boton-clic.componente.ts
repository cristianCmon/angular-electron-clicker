import { Component, signal, ChangeDetectorRef } from "@angular/core";
import { ServicioSqlite3 } from "../../servicios/servicioSqlite3";
import { FormsModule } from '@angular/forms';

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
    selector: 'app-boton-clic',
    standalone: true,
    imports: [FormsModule],
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
    animarContador = false;
    mostrarModalPuntuaciones = false;
    mostrarModalFinPartida = false;
    nombreJugador = '';
    listaPuntuaciones: any[] = [];

    timer = 20; // Valor inicial timer
    intervalo: any;


    aumentarContador(valor: number) {
        if (!this.finPartida) {
            if (this.empezarCuenta) {
                // this.textoBoton = this.timer.toString(10);
                this.iniciarContadorDescendente();
                this.empezarCuenta = false;
            }

            this.contador += valor;
            this.contadorSignal.update((actual) => actual + valor);

            // LÓGICA DE LA ANIMACIÓN
            // Activamos animación
            this.animarContador = true;
            // Reiniciamos la variable a los 50ms
            setTimeout(() => {
                this.animarContador = false;
                this.cd.detectChanges(); // Forzamos detección
            }, 50);
    
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
                // Mostramos modal registro puntuación
                this.finalizarPartida();
            }
        }, 10); //1000 para 1seg, 10 para precisión de centésimas
    }

    formatearTiempo(ms: number): string {
        const segundos = Math.floor(ms / 1000);
        const milisegundos = Math.floor((ms % 1000) / 10); // Obtenemos 2 dígitos
        
        // padStart asegura que siempre haya dos dígitos
        return `${segundos.toString().padStart(2, '0')}.${milisegundos.toString().padStart(2, '0')}`;
    }

    reiniciarPartida() { // Reseteamos variables
        this.contador = 0;
        this.contadorSignal.set(0);
        this.empezarCuenta = true;
        this.finPartida = false;
        this.timer = 20;
        this.textoBoton = '¡Clica!';
        this.nombreJugador = '';
        this.cd.detectChanges();
    }

    async finalizarPartida() {
        this.mostrarModalFinPartida = true;
        this.cd.detectChanges();
    }

    async guardarPuntuacion() {
        // Evita validar pulsando Enter
        if (this.nombreJugador.trim() === '') {
            return;
        }

        try {
            await this.servicioSqlite.registrarPuntuacion(this.nombreJugador, this.contador.toString());
            this.mostrarModalFinPartida = false;
            this.reiniciarPartida();

        } catch (error) {
            console.error('ERROR GUARDADO:', error);
        }
    }

    cancelarGuardado() {
        this.mostrarModalFinPartida = false;
        this.reiniciarPartida();
    }

    async verPuntuaciones() {
        // MOSTRAR MODAL
        // console.log("Botón pulsado");
        try {
            const resultado = await this.servicioSqlite.obtenerPuntuaciones();
            // console.log('Datos recibidos:', resultado);
            this.listaPuntuaciones = resultado;
            this.mostrarModalPuntuaciones = true;
            this.cd.detectChanges();

        } catch (error) {
            console.error('ERROR - Fallo al mostrar puntuaciones:', error);
        }
    }

    cerrarPuntuaciones() {
        // console.log('Modal puntuaciones cerrado');
        this.mostrarModalPuntuaciones = false;
    }
}
