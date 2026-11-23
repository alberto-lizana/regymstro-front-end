import { Routes } from '@angular/router';
import { adminGuard, authGuard, guestGuard } from './guards/auth-guard';

export const routes: Routes = [

  // Sin navbar
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login').then(m => m.Login),
  },
  {
    path: 'registro',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/registro/registro').then(m => m.Registro),
  },
  {
    path: 'recuperar',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/recuperar-password/recuperar-password').then(m => m.RecuperarPassword),
  },
  {
    path: 'restablecer',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/restablecer-password/restablecer-password').then(m => m.RestablecerPassword),
  },

  // Con navbar (layout)
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./components/layout/layout').then(m => m.Layout),
    children: [
      {
        path: 'inicio',
        loadComponent: () => import('./pages/inicio/inicio').then(m => m.Inicio),
      },
      {
        path: 'perfil',
        loadComponent: () => import('./pages/perfil/perfil').then(m => m.Perfil),
      },
      {
        path: 'usuarios',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard),
      },
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
    ],
  },

  { path: '**', redirectTo: 'inicio' },
];