import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService, Employee } from './employee';

@Component({
    selector: 'app-employee-list',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        RouterModule,
        MatFormFieldModule,
        MatInputModule,
        MatTooltipModule,
    ],
    templateUrl: './employee-list.html',
    styleUrl: './employee-list.css',
})
export class EmployeeListComponent implements OnInit {
    private service = inject(EmployeeService);
    private snackBar = inject(MatSnackBar);

    // SIGNALS
    employees = signal<Employee[]>([]);
    searchQuery = signal(''); // Hier speichern wir den Suchtext

    // COMPUTED: Automatische Berechnung der gefilterten Liste
    filteredEmployees = computed(() => {
        const query = this.searchQuery().toLowerCase();
        const list = this.employees();

        if (!query) return list;

        return list.filter((emp) => {
            const first = (emp.first_name || '').toLowerCase();
            const last = (emp.last_name || '').toLowerCase();
            const email = (emp.email || '').toLowerCase();
            const dept = String(emp.department || '').toLowerCase();
            const pos = String(emp.position || '').toLowerCase();

            return (
                first.includes(query) ||
                last.includes(query) ||
                email.includes(query) ||
                dept.includes(query) ||
                pos.includes(query)
            );
        });
    });

    displayedColumns: string[] = ['status', 'name', 'email', 'department', 'position', 'actions'];

    ngOnInit() {
        this.loadEmployees();
    }

    loadEmployees() {
        this.service.getEmployees().subscribe({
            next: (data) => {
                // Einfach Signal setzen - kein setTimeout oder cdr nötig!
                this.employees.set(data);
            },
            error: (err) => console.error(err),
        });
    }

    approveEmployee(emp: Employee) {
        if (!emp.id) return;

        const updatedEmp = { ...emp, is_approved: true };

        this.service.updateEmployee(emp.id, updatedEmp).subscribe(() => {
            this.snackBar.open(`${emp.first_name} wurde freigegeben!`, 'OK', {
                duration: 3000,
            });
            this.loadEmployees();
        });
    }

    deleteEmployee(id: number | undefined) {
        if (!id) return;

        if (confirm('Mitarbeiter wirklich löschen?')) {
            this.service.deleteEmployee(id).subscribe(() => {
                this.loadEmployees();
                this.snackBar.open('Gelöscht.', 'OK', { duration: 3000 });
            });
        }
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        // Wir setzen nur das Signal. Das 'computed' oben macht den Rest.
        this.searchQuery.set(filterValue);
    }
}
