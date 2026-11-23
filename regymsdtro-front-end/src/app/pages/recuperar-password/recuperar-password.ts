import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-recuperar-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './recuperar-password.html',
})
export class RecuperarPassword {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly cargando = signal(false);
  readonly mensajeError = signal('');
  readonly codigo = signal<string | null>(null);

  readonly recuperarForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  solicitarCodigo(): void {
    if (this.recuperarForm.invalid) {
      this.recuperarForm.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.mensajeError.set('');

    this.authService.recuperarPassword(this.recuperarForm.getRawValue()).subscribe({
      next: (res) => {
        this.cargando.set(false);
        this.codigo.set(res.codigoString);
      },
      error: (err: HttpErrorResponse) => {
        this.cargando.set(false);
        this.mensajeError.set(
          err.status === 0
            ? 'No se pudo conectar con el servidor.'
            : 'No existe un usuario con ese correo.',
        );
      },
    });
  }

  continuar(): void {
    this.router.navigate(['/restablecer'], {
      queryParams: { email: this.recuperarForm.controls.email.value },
    });
  }
}