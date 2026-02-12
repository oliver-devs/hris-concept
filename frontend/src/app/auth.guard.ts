import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.isLoggedIn()) {
        return true; // Darf passieren
    } else {
        router.navigate(['/login']); // Ab zur Login-Seite
        return false;
    }
};
