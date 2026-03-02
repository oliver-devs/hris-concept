import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDivider } from '@angular/material/divider';
import { AuthService } from './auth/auth.service';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        RouterModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
        MatToolbarModule,
        MatDivider,
    ],
    templateUrl: './app.html',
    styleUrl: './app.css',
})
export class AppComponent {
    readonly auth = inject(AuthService);

    logout() {
        this.auth.logout();
    }
}
