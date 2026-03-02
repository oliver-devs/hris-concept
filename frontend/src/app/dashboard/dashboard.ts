import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { EmployeeService, Employee, Department } from '../employee/employee';
import { AuthService, CurrentUser } from '../auth/auth.service';

@Component({
    selector: 'app-dashboard',
    imports: [MatCardModule, MatIconModule, MatButtonModule, RouterModule],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
    private readonly service = inject(EmployeeService);
    private readonly authService = inject(AuthService);

    readonly totalEmployees = signal(0);
    readonly recentEmployees = signal<Employee[]>([]);
    readonly departments = signal<Department[]>([]);
    readonly currentUser = signal<CurrentUser | null>(null);

    readonly formattedName = computed(() => {
        const user = this.currentUser();
        if (!user?.username) return 'Lade...';

        return user.username
            .split('.')
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ');
    });

    ngOnInit() {
        this.loadData();
    }

    private loadData() {
        this.authService.getCurrentUser().subscribe({
            next: (user) => this.currentUser.set(user),
            error: () => this.currentUser.set({ username: 'Gast', email: '' }),
        });

        this.service.getEmployees().subscribe({
            next: (data) => {
                this.totalEmployees.set(data.length);
                this.recentEmployees.set([...data].reverse().slice(0, 5));
            },
            error: (err) => console.error('Fehler bei Mitarbeitern', err),
        });

        this.service.getDepartments().subscribe((data) => {
            this.departments.set(data);
        });
    }
}
