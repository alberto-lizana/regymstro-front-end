import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { API_URL } from '../utils/api-url';
import {
  AuthResponse,
  CodigoRecuperarResponse,
  LoginRequest,
  RecuperarPasswordRequest,
  RestablecerPasswordRequest,
} from '../interfaces/auth.interface';

const TOKEN_KEY = 'auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  readonly token = this._token.asReadonly();
  readonly isLoggedIn = computed(() => !!this._token());

  readonly rol = computed(() => {
    const token = this._token();
    if (!token) return null;
    try {
      const payload = JSON.parse(
        atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')),
      );
      const r = payload.rol ?? payload.role ?? payload.roles ?? payload.authorities;
      const valor = Array.isArray(r) ? r[0] : r;
      return typeof valor === 'object' ? (valor?.authority ?? null) : (valor ?? null);
    } catch {
      return null;
    }
  });

  readonly esAdmin = computed(() => {
    const r = this.rol();
    return r === 'ADMIN' || r === 'ROLE_ADMIN';
  });

  login(credenciales: LoginRequest) {
    return this.http
      .post<AuthResponse>(`${API_URL}/auth/login`, credenciales)
      .pipe(
        tap(({ token }) => {
          localStorage.setItem(TOKEN_KEY, token);
          this._token.set(token);
        }),
      );
  }

  recuperarPassword(request: RecuperarPasswordRequest) {
    return this.http.post<CodigoRecuperarResponse>(`${API_URL}/auth/recuperar`, request);
  }

  restablecerPassword(request: RestablecerPasswordRequest) {
    return this.http.post<void>(`${API_URL}/auth/restablecer`, request);
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    this._token.set(null);
    this.router.navigate(['/login']);
  }
}