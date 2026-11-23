
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly cargando = signal(false);
  readonly mensajeError = signal('');

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  iniciarSesion(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.mensajeError.set('');

    this.authService.login(this.loginForm.getRawValue()).subscribe({

      next: () => {

        if (this.authService.esAdmin()) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/inicio']);
        }

      },

      error: (err: HttpErrorResponse) => {

        this.cargando.set(false);

        this.mensajeError.set(
          err.status === 0
            ? 'No se pudo conectar con el servidor.'
            : 'Correo o contraseña incorrectos.',
        );

      },

    });
  }
}
