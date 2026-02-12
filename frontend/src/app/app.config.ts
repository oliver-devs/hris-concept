import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';

// WICHTIG: Diese beiden Imports müssen da sein!
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideAnimations(),

        // HIER IST DER FEHLER MEISTENS:
        // Steht bei dir nur "provideHttpClient()"?
        // Es MUSS so aussehen:
        provideHttpClient(withInterceptors([authInterceptor])),
    ],
};
