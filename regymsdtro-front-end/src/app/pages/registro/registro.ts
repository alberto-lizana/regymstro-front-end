import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/usuario';

const PATRON_PASSWORD = /^(?!\s)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?<!\s).*$/;

function passwordsIguales(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const rPassword = group.get('rPassword')?.value;
  return password === rPassword ? null : { noCoinciden: true };
}

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
})
export class Registro {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly usuarioService = inject(UsuarioService);
  private readonly router = inject(Router);

  readonly cargando = signal(false);
  readonly mensajeError = signal('');

  readonly registroForm = this.fb.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      appat: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      apmat: ['', [Validators.maxLength(50)]],
      fechaNacimiento: ['', Validators.required],
      sexo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(50),
          Validators.pattern(PATRON_PASSWORD),
        ],
      ],
      rPassword: ['', Validators.required],
    },
    { validators: passwordsIguales },
  );

  registrar(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.mensajeError.set('');

    const { rPassword, ...request } = this.registroForm.getRawValue();

    this.usuarioService.registrarUsuario(request).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err: HttpErrorResponse) => {
        console.error('ERROR REGISTRO:', err.status, err.error);
        this.cargando.set(false);
        this.mensajeError.set(
          err.status === 0
            ? 'No se pudo conectar con el servidor.'
            : err.status === 409
              ? 'Ese correo ya está registrado.'
              : (err.error?.message ?? 'No se pudo crear la cuenta.'),
        );
      },
    });
  }
}