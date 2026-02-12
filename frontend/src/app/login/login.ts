import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
    ],
    templateUrl: './login.html',
    styleUrl: './login.css',
})
export class LoginComponent {
    // Services per inject() holen
    private auth = inject(AuthService);
    private router = inject(Router);
    private snackBar = inject(MatSnackBar);

    // Daten für das Formular (Mutable für ngModel)
    username = '';
    password = '';

    // UI-State als Signal
    isLoading = signal(false);

    onLogin() {
        // Sicherheitscheck: Nicht nochmal senden, wenn schon lädt
        if (this.isLoading()) return;

        // Ladezustand aktivieren
        this.isLoading.set(true);

        this.auth.login(this.username, this.password).subscribe({
            next: () => {
                // Erfolgreich: Weiterleiten
                this.router.navigate(['/dashboard']);
                // (isLoading muss nicht auf false gesetzt werden, da wir die Seite verlassen)
            },
            error: () => {
                // Fehler: Ladezustand beenden und Meldung zeigen
                this.isLoading.set(false);
                this.snackBar.open('Falsche Zugangsdaten!', 'OK', { duration: 3000 });
            },
        });
    }
}
