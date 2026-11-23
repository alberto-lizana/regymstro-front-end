import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { Listado } from '../../components/listado/listado';
import { AsignarRolPlan } from '../../components/asignar-rol-plan/asignar-rol-plan';
import { UsuarioService } from '../../services/usuario';
import { AuthService } from '../../services/auth';

import { ColumnaListado, AccionListado } from '../../interfaces/listado.interface';
import { UsuarioResponseDto } from '../../interfaces/usuario.interface';

type UsuarioFila = UsuarioResponseDto & { nombreCompleto: string };

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [FormsModule, Listado, AsignarRolPlan],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.less'
})

export class Dashboard {

    private readonly usuarioService = inject(UsuarioService);
    private readonly authService = inject(AuthService);

    readonly usuarios = signal<UsuarioFila[]>([]);
    readonly email = signal('');
    readonly idBuscar = signal('');

    readonly cargando = signal(false);
    readonly mensajeError = signal('');
    readonly mensajeExito = signal('');
    readonly mostrarResultados = signal(false);
    readonly modo = signal<'todos' | 'busqueda' | 'perfil' | null>(null);

    readonly paginaActual = signal(0);
    readonly totalPaginas = signal(0);
    readonly totalElementos = signal(0);
    readonly tamanioPagina = 5;

    // Usuario que se está editando en el modal
    readonly editandoAdmin = signal<UsuarioFila | null>(null);

    readonly columnasUsuarios: ColumnaListado[] = [
        { campo: 'idUsuario', titulo: 'ID' },
        { campo: 'nombreCompleto', titulo: 'Nombre completo' },
        { campo: 'email', titulo: 'Correo electrónico' },
        { campo: 'plan', titulo: 'Plan' },
        { campo: 'nombreRol', titulo: 'Rol' },
        { campo: 'isActive', titulo: 'Activo' }
    ];

    readonly accionesUsuarios: AccionListado[] = [
        { id: 'modificar', titulo: 'Asignar rol y plan', icono: 'bi bi-pencil', clase: 'btn-outline-primary' },
        { id: 'logico', titulo: 'Borrado lógico', icono: 'bi bi-person-x', clase: 'btn-outline-warning' },
        { id: 'fisico', titulo: 'Borrado físico', icono: 'bi bi-trash', clase: 'btn-outline-danger' }
    ];

    private conNombreCompleto(u: UsuarioResponseDto): UsuarioFila {
        return { ...u, nombreCompleto: `${u.nombre} ${u.appat} ${u.apmat ?? ''}`.trim() };
    }

    obtenerTodos(pagina: number = 0): void {
        this.modo.set('todos');
        this.cargando.set(true);
        this.mensajeError.set('');
        this.mostrarResultados.set(true);

        this.usuarioService.obtenerTodos(pagina, this.tamanioPagina).subscribe({
            next: (response) => {
                this.usuarios.set(response.content.map(u => this.conNombreCompleto(u)));
                this.paginaActual.set(response.number);
                this.totalPaginas.set(response.totalPages);
                this.totalElementos.set(response.totalElements);
                this.cargando.set(false);
            },
            error: (error) => {
                console.error('ERROR HTTP:', error);
                this.usuarios.set([]);
                this.mensajeError.set('No se pudieron cargar los usuarios.');
                this.cargando.set(false);
            },
        });
    }

    buscarPorEmail(): void {
        const valor = this.email().trim();
        if (!valor) {
            this.mensajeError.set('Ingrese un correo electrónico.');
            return;
        }
        this.mostrarUno(this.usuarioService.obtenerPorEmail(valor), 'busqueda',
            'No se encontró un usuario con ese correo.');
    }

    buscarPorId(): void {
        const id = Number(this.idBuscar());
        if (!id) {
            this.mensajeError.set('Ingrese un ID válido.');
            return;
        }
        this.mostrarUno(this.usuarioService.obtenerPorId(id), 'busqueda',
            'No se encontró un usuario con ese ID.');
    }

    miPerfil(): void {
        this.mostrarUno(this.usuarioService.obtenerMiPerfil(), 'perfil',
            'No se pudo cargar tu perfil.');
    }

    private mostrarUno(peticion: Observable<UsuarioResponseDto>, modo: 'busqueda' | 'perfil', mensajeFallo: string): void {
        this.modo.set(modo);
        this.cargando.set(true);
        this.mensajeError.set('');
        this.mostrarResultados.set(true);

        peticion.subscribe({
            next: (response) => {
                this.usuarios.set([this.conNombreCompleto(response)]);
                this.paginaActual.set(0);
                this.totalPaginas.set(1);
                this.totalElementos.set(1);
                this.cargando.set(false);
            },
            error: (error) => {
                console.error('ERROR HTTP:', error);
                this.usuarios.set([]);
                this.mensajeError.set(mensajeFallo);
                this.cargando.set(false);
            },
        });
    }


    ejecutarAccion(evento: { accion: string; fila: Record<string, any> }): void {
        const fila = evento.fila as UsuarioFila;
        this.mensajeError.set('');
        this.mensajeExito.set('');

        switch (evento.accion) {
            case 'modificar': this.editandoAdmin.set(fila); break;
            case 'logico': this.borradoLogico(fila); break;
            case 'fisico': this.borradoFisico(fila); break;
        }
    }

    private borradoLogico(fila: UsuarioFila): void {
        const activar = !fila.isActive;
        const pregunta = activar
            ? `¿Reactivar a ${fila.nombreCompleto}?`
            : `¿Desactivar a ${fila.nombreCompleto}?`;

        if (!confirm(pregunta)) return;

        this.usuarioService.borradoLogico(fila.idUsuario).subscribe({
            next: () => {
                this.usuarios.update(lista =>
                    lista.map(u => u.idUsuario === fila.idUsuario ? { ...u, isActive: activar } : u));
                this.mensajeExito.set(`${fila.nombreCompleto} fue ${activar ? 'reactivado' : 'desactivado'}.`);
            },
            error: (error) => {
                console.error('ERROR HTTP:', error);
                this.mensajeError.set(error.error?.message ?? 'No se pudo cambiar el estado del usuario.');
            },
        });
    }

    private borradoFisico(fila: UsuarioFila): void {
        if (!confirm(`¿Eliminar DEFINITIVAMENTE a ${fila.nombreCompleto}? No se puede deshacer.`)) return;

        this.usuarioService.borradoFisico(fila.idUsuario).subscribe({
            next: () => {
                if (this.modo() === 'todos') {
                    const pagina = this.usuarios().length === 1 && this.paginaActual() > 0
                        ? this.paginaActual() - 1
                        : this.paginaActual();
                    this.obtenerTodos(pagina);
                } else {
                    this.usuarios.set([]);
                    this.totalElementos.set(0);
                }
                this.mensajeExito.set(`${fila.nombreCompleto} fue eliminado.`);
            },
            error: (error) => {
                console.error('ERROR HTTP:', error);
                this.mensajeError.set(error.error?.message ?? 'No se pudo eliminar al usuario.');
            },
        });
    }

    cerrarAdmin(): void {
        this.editandoAdmin.set(null);
    }

    alGuardar(): void {
        const usuario = this.editandoAdmin();
        this.cerrarAdmin();
        this.mensajeExito.set(`Se actualizó a ${usuario?.nombreCompleto}.`);

        if (this.modo() === 'todos') {
            this.obtenerTodos(this.paginaActual());
        } else if (usuario) {
            this.mostrarUno(this.usuarioService.obtenerPorId(usuario.idUsuario), 'busqueda',
                'No se pudo recargar al usuario.');
        }
    }
}