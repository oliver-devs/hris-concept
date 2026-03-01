import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface CurrentUser {
    username: string;
    email: string;
}

export interface ChangePasswordResponse {
    detail: string;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly apiUrl = environment.apiUrl;

    isLoggedIn = signal<boolean>(!!localStorage.getItem('token'));

    constructor(
        private http: HttpClient,
        private router: Router,
    ) {}

    login(username: string, password: string) {
        return this.http.post<{ token: string }>(`${this.apiUrl}login/`, { username, password }).pipe(
            tap((response) => {
                localStorage.setItem('token', response.token);
                this.isLoggedIn.set(true);
            }),
        );
    }

    logout() {
        localStorage.removeItem('token');
        this.isLoggedIn.set(false);
        this.router.navigate(['/login']);
    }

    getToken() {
        return localStorage.getItem('token');
    }

    getCurrentUser(): Observable<CurrentUser> {
        return this.http.get<CurrentUser>(`${this.apiUrl}me/`);
    }

    changePassword(data: { old_password: string; new_password: string }): Observable<ChangePasswordResponse> {
        return this.http.post<ChangePasswordResponse>(`${this.apiUrl}change-password/`, data);
    }
}
