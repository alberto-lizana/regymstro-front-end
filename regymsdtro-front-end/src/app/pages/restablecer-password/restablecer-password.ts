import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-restablecer-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './restablecer-password.html',
})
export class RestablecerPassword {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly cargando = signal(false);
  readonly mensajeError = signal('');

  readonly restablecerForm = this.fb.group({
    email: [this.route.snapshot.queryParamMap.get('email') ?? '', [Validators.required, Validators.email]],
    codigo: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    nuevaPassword: ['', Validators.required],
  });

  restablecer(): void {
    if (this.restablecerForm.invalid) {
      this.restablecerForm.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.mensajeError.set('');

    this.authService.restablecerPassword(this.restablecerForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err: HttpErrorResponse) => {
        this.cargando.set(false);
        this.mensajeError.set(
          err.status === 0
            ? 'No se pudo conectar con el servidor.'
            : (err.error?.message ?? 'Código inválido o expirado.'),
        );
      },
    });
  }
}