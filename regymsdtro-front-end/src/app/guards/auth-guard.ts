import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = () => {

    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isLoggedIn()
        ? true
        : router.createUrlTree(['/login']);
};


export const guestGuard: CanActivateFn = () => {

    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
        return true;
    }

    return router.createUrlTree([
        authService.esAdmin() ? '/dashboard' : '/inicio'
    ]);
};


export const adminGuard: CanActivateFn = () => {

    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isLoggedIn() && authService.esAdmin()
        ? true
        : router.createUrlTree(['/inicio']);
};