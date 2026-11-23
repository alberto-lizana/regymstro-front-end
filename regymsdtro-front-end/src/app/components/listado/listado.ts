import { Component, Input, Output, EventEmitter } from '@angular/core';

import {
    ColumnaListado,
    AccionListado
} from '../../interfaces/listado.interface';

@Component({
    selector: 'app-listado',
    standalone: true,
    templateUrl: './listado.html',
    styleUrl: './listado.less'
})
export class Listado {

    @Input() columnas: ColumnaListado[] = [];

    @Input() datos: Record<string, any>[] = [];

    @Input() acciones: AccionListado[] = [];

    @Input() cargando = false;

    @Input() paginaActual = 0;

    @Input() totalPaginas = 0;

    @Input() totalElementos = 0;

    @Input() tamanioPagina = 10;

    @Output() cambiarPagina = new EventEmitter<number>();

    @Output() ejecutarAccion = new EventEmitter<{
        accion: string;
        fila: Record<string, any>;
    }>();

    paginaAnterior(): void {
        if (this.paginaActual > 0) {
            this.cambiarPagina.emit(this.paginaActual - 1);
        }
    }

    paginaSiguiente(): void {
        if (this.paginaActual < this.totalPaginas - 1) {
            this.cambiarPagina.emit(this.paginaActual + 1);
        }
    }

    ejecutar(accion: string, fila: Record<string, any>): void {
        this.ejecutarAccion.emit({
            accion,
            fila
        });
    }
}