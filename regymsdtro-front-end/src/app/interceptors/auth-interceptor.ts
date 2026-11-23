import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token();

  // No adjuntar token a los endpoints públicos de /auth
  const esPublica = req.url.includes('/auth/');

  const peticion =
    token && !esPublica
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(peticion).pipe(
    catchError((err: HttpErrorResponse) => {
      // Token vencido o inválido en una ruta protegida
      if (err.status === 401 && !esPublica) {
        auth.logout();
      }
      return throwError(() => err);
    }),
  );
};