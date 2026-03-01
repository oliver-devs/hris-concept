import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { EmployeeService, Employee, Department } from '../employee/employee';
import { AuthService, CurrentUser } from '../auth/auth.service';

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

    totalEmployees = signal(0);
    recentEmployees = signal<Employee[]>([]);
    departments = signal<Department[]>([]);
    currentUser = signal<CurrentUser | null>(null);

    formattedName = computed(() => {
        const user = this.currentUser();
        if (!user || !user.username) return 'Lade...';

        return user.username
            .split('.')
            .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ');
    });

    ngOnInit() {
        this.loadData();
    }

    loadData() {
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
