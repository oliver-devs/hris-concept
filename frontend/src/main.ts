import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
// WICHTIG: Pfad ist './app/app', aber die Klasse heißt meistens noch AppComponent
import { AppComponent } from './app/app';

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
