import { Injectable, signal } from '@angular/core'; // <--- signal importieren
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = 'http://127.0.0.1:8000/api/login/';

    // HIER IST DER TRICK: Ein Signal, das sich automatisch aktualisiert
    // Es prüft beim Start sofort, ob schon ein Token da ist
    isLoggedIn = signal<boolean>(!!localStorage.getItem('token'));

    constructor(
        private http: HttpClient,
        private router: Router,
    ) {}

    login(username: string, password: string) {
        return this.http.post<{ token: string }>(this.apiUrl, { username, password }).pipe(
            tap((response) => {
                localStorage.setItem('token', response.token);
                // WICHTIG: Wir sagen dem Signal "Du bist jetzt eingeloggt!"
                this.isLoggedIn.set(true);
            }),
        );
    }

    logout() {
        localStorage.removeItem('token');
        // WICHTIG: Wir sagen dem Signal "Du bist jetzt raus!"
        this.isLoggedIn.set(false);
        this.router.navigate(['/login']);
    }

    getToken() {
        return localStorage.getItem('token');
    }

    getCurrentUser() {
        return this.http.get<any>('http://127.0.0.1:8000/api/me/');
    }
}
