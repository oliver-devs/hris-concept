import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CompanyService } from '../shared/company.service';

@Component({
    selector: 'app-login',
    imports: [
        FormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
    ],
    templateUrl: './login.html',
    styleUrl: './login.css',
})
export class LoginComponent {
    private readonly auth = inject(AuthService);
    private readonly router = inject(Router);
    private readonly snackBar = inject(MatSnackBar);
    readonly companyService = inject(CompanyService);

    username = '';
    password = '';
    readonly isLoading = signal(false);
    readonly currentYear = new Date().getFullYear();

    onLogin() {
        if (this.isLoading()) return;

        this.isLoading.set(true);

        this.auth.login(this.username, this.password).subscribe({
            next: () => this.router.navigate(['/dashboard']),
            error: () => {
                this.isLoading.set(false);
                this.snackBar.open('Falsche Zugangsdaten!', 'OK', { duration: 3000 });
            },
        });
    }
}
