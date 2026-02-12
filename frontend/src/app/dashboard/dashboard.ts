import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { EmployeeService, Employee, Department } from '../employee/employee';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, RouterModule],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
    private service = inject(EmployeeService);
    private authService = inject(AuthService);

    // Daten-Signale
    totalEmployees = signal(0);
    recentEmployees = signal<Employee[]>([]);
    departments = signal<Department[]>([]);

    // KORREKTUR: Wir erstellen ein eigenes Signal, das wir später befüllen
    currentUser = signal<any>(null);

    // Berechneter Name (Computed Signal)
    formattedName = computed(() => {
        const user = this.currentUser();

        // 1. Fallback: Noch kein User geladen?
        if (!user || !user.username) return 'Lade...';

        // 2. Formatierung: "max.mustermann" -> "Max Mustermann"
        return user.username
            .split('.') // Trennen am Punkt
            .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1)) // Erster Buchstabe groß
            .join(' '); // Mit Leerzeichen zusammenfügen
    });

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        console.log('Lade Dashboard Daten...');

        // 1. User laden und Signal setzen
        this.authService.getCurrentUser().subscribe({
            next: (user) => {
                console.log('User geladen:', user);
                this.currentUser.set(user); // Hier füllen wir das Signal!
            },
            error: () => {
                this.currentUser.set({ username: 'Gast' }); // Fallback bei Fehler
            },
        });

        // 2. Mitarbeiter laden
        this.service.getEmployees().subscribe({
            next: (data) => {
                this.totalEmployees.set(data.length);
                this.recentEmployees.set([...data].reverse().slice(0, 5));
            },
            error: (err) => console.error('Fehler bei Mitarbeitern', err),
        });

        // 3. Abteilungen laden
        this.service.getDepartments().subscribe((data) => {
            this.departments.set(data);
        });
    }
}
