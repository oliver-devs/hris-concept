import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from './auth.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        RouterModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
        MatToolbarModule,
    ],
    // Hier verweisen wir jetzt auf die Dateien:
    templateUrl: './app.html',
    styleUrl: './app.css',
})
export class AppComponent {
    // Service injecten (public, damit das HTML darauf zugreifen kann)
    public auth = inject(AuthService);

    logout() {
        this.auth.logout();
    }
}
