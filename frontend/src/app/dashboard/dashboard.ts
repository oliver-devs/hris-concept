import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '../shared/employee.service';
import { DepartmentService } from '../shared/department.service';
import { AbsenceService } from '../shared/absence.service';
import { Employee, Department, Absence } from '../shared/models';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'app-dashboard',
    imports: [MatCardModule, MatIconModule, MatButtonModule, MatTooltipModule, RouterModule],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
    private readonly employeeService = inject(EmployeeService);
    private readonly departmentService = inject(DepartmentService);
    private readonly absenceService = inject(AbsenceService);
    readonly auth = inject(AuthService);
    private readonly snackBar = inject(MatSnackBar);

    readonly totalEmployees = signal(0);
    readonly allEmployees = signal<Employee[]>([]);
    readonly departments = signal<Department[]>([]);
    readonly absences = signal<Absence[]>([]);

    readonly formattedName = computed(() => {
        const user = this.auth.currentUser();
        if (user?.first_name) return `${user.first_name} ${user.last_name}`;
        if (!user?.username) return 'Lade...';
        return user.username
            .split('.')
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ');
    });

    readonly subtitle = computed(() => {
        const user = this.auth.currentUser();
        const parts: string[] = [];
        if (user?.position_title) parts.push(user.position_title);
        if (user?.department_name) parts.push(user.department_name);
        return parts.join(' · ') || '';
    });

    readonly onVacationToday = computed(() => {
        const today = new Date().toISOString().slice(0, 10);
        return this.absences().filter(
            (a) =>
                a.absence_type === 'vacation' &&
                a.status === 'approved' &&
                a.start_date <= today &&
                a.end_date >= today,
        );
    });

    readonly absentToday = computed(() => {
        const today = new Date().toISOString().slice(0, 10);
        return this.absences().filter(
            (a) =>
                a.status === 'approved' &&
                a.start_date <= today &&
                a.end_date >= today,
        );
    });

    readonly pendingRequests = computed(() =>
        this.absences().filter((a) => a.status === 'pending'),
    );

    readonly maxDepartmentCount = computed(() => {
        const depts = this.departments();
        if (!depts || depts.length === 0) return 1;
        return Math.max(...depts.map(d => d.employee_count || 0));
    });

    readonly myDepartmentEmployees = computed(() => {
        const deptId = this.auth.currentUser()?.department_id;
        if (!deptId) return [];
        return this.allEmployees().filter((e) => e.department === deptId);
    });

    readonly myDepartmentAbsent = computed(() => {
        const deptId = this.auth.currentUser()?.department_id;
        if (!deptId) return [];
        const today = new Date().toISOString().slice(0, 10);
        const deptEmployeeIds = new Set(this.myDepartmentEmployees().map((e) => e.id));
        return this.absences().filter(
            (a) =>
                deptEmployeeIds.has(a.employee) &&
                a.status === 'approved' &&
                a.start_date <= today &&
                a.end_date >= today,
        );
    });

    readonly recentEmployees = computed(() =>
        [...this.allEmployees()].reverse().slice(0, 5),
    );

    ngOnInit() {
        this.loadData();
    }

    private loadData() {
        this.employeeService.getEmployees().subscribe({
            next: (data) => {
                this.allEmployees.set(data);
                this.totalEmployees.set(data.length);
            },
            error: () =>
                this.snackBar.open('Fehler beim Laden der Mitarbeiter.', 'OK', { duration: 4000 }),
        });

        this.departmentService.getDepartments().subscribe({
            next: (data) => this.departments.set(data),
            error: () =>
                this.snackBar.open('Fehler beim Laden der Abteilungen.', 'OK', { duration: 4000 }),
        });

        this.absenceService.getAbsences().subscribe({
            next: (data) => this.absences.set(data),
            error: () =>
                this.snackBar.open('Fehler beim Laden der Abwesenheiten.', 'OK', { duration: 4000 }),
        });
    }
}
