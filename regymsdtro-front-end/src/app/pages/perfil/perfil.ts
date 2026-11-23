import { Component, inject, OnInit, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, concat, toArray } from 'rxjs';

import { UsuarioService } from '../../services/usuario';
import { UsuarioResponseDto } from '../../interfaces/usuario.interface';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './perfil.html',
})
export class Perfil implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly perfil = signal<UsuarioResponseDto | null>(null);
  readonly cargando = signal(true);
  readonly guardando = signal(false);
  readonly mensajeError = signal('');
  readonly mensajeExito = signal('');

  readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    appat: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    apmat: ['', [Validators.maxLength(50)]],
    fechaNacimiento: ['', Validators.required],
    sexo: ['', Validators.required],
  });

  ngOnInit(): void {
    this.usuarioService.obtenerMiPerfil().subscribe({
      next: (p) => {
        this.cargarEnFormulario(p);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('ERROR HTTP:', error);
        this.mensajeError.set('No se pudo cargar tu perfil.');
        this.cargando.set(false);
      },
    });
  }

  private cargarEnFormulario(p: UsuarioResponseDto): void {
    this.perfil.set(p);
    this.form.setValue({
      nombre: p.nombre,
      appat: p.appat,
      apmat: p.apmat ?? '',
      fechaNacimiento: p.fechaNacimiento,
      sexo: p.sexo,
    });
    this.form.markAsPristine();
  }

  guardar(): void {
    const original = this.perfil();
    if (!original) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    const cambios: Observable<UsuarioResponseDto>[] = [];

    if (v.nombre !== original.nombre) cambios.push(this.usuarioService.modificarNombre(v.nombre));
    if (v.appat !== original.appat) cambios.push(this.usuarioService.modificarAppat(v.appat));
    if (v.apmat !== (original.apmat ?? '')) cambios.push(this.usuarioService.modificarApmat(v.apmat));
    if (v.fechaNacimiento !== original.fechaNacimiento) cambios.push(this.usuarioService.modificarFechaNacimiento(v.fechaNacimiento));
    if (v.sexo !== original.sexo) cambios.push(this.usuarioService.modificarSexo(v.sexo));

    this.mensajeError.set('');
    this.mensajeExito.set('');

    if (cambios.length === 0) {
      this.mensajeExito.set('No hay cambios que guardar.');
      return;
    }

    this.guardando.set(true);

    concat(...cambios).pipe(toArray()).subscribe({
      next: (respuestas) => {
        this.cargarEnFormulario(respuestas[respuestas.length - 1]);
        this.guardando.set(false);
        this.mensajeExito.set('Tus datos fueron actualizados.');
      },
      error: (error) => {
        console.error('ERROR HTTP:', error);
        this.guardando.set(false);
        this.mensajeError.set(error.error?.message ?? 'No se pudieron guardar los cambios.');
      },
    });
  }

  restablecer(): void {
    const p = this.perfil();
    if (p) this.cargarEnFormulario(p);
    this.mensajeError.set('');
    this.mensajeExito.set('');
  }
}