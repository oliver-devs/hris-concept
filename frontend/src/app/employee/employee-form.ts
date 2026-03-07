import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';

import { EmployeeService } from '../shared/employee.service';
import { DepartmentService } from '../shared/department.service';
import { PositionService } from '../shared/position.service';
import { Employee, Department, Position } from '../shared/models';
import { PasswordDialogComponent } from '../shared/password-dialog';

@Component({
    selector: 'app-employee-form',
    imports: [
        FormsModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        RouterModule,
        MatIconModule,
        MatSelectModule,
    ],
    templateUrl: './employee-form.html',
    styleUrl: './employee-form.css',
})
export class EmployeeFormComponent implements OnInit {
    private readonly employeeService = inject(EmployeeService);
    private readonly departmentService = inject(DepartmentService);
    private readonly positionService = inject(PositionService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly snackBar = inject(MatSnackBar);
    private readonly dialog = inject(MatDialog);

    readonly departments = signal<Department[]>([]);
    readonly allPositions = signal<Position[]>([]);
    readonly isEditMode = signal(false);

    readonly employee = signal<Employee>({
        first_name: '',
        last_name: '',
        email: '',
        department: 0,
        position: null,
    });

    readonly filteredPositions = computed(() => {
        const deptId = this.employee().department;
        if (!deptId) return [];
        return this.allPositions().filter((p) => p.department === deptId);
    });

    ngOnInit() {
        this.departmentService.getDepartments().subscribe((depts) => {
            this.departments.set(depts);

            this.positionService.getPositions().subscribe((positions) => {
                this.allPositions.set(positions);

                const id = this.route.snapshot.paramMap.get('id');
                if (id) {
                    this.isEditMode.set(true);
                    this.loadEmployee(+id);
                }
            });
        });
    }

    loadEmployee(id: number) {
        this.employeeService.getEmployee(id).subscribe({
            next: (data) => this.employee.set(data),
            error: (err) => {
                this.snackBar.open('Fehler beim Laden', 'OK');
                console.error(err);
            },
        });
    }

    updateField(key: keyof Employee, value: Employee[keyof Employee]) {
        this.employee.update((current) => {
            const updated = { ...current, [key]: value };
            // Position zurücksetzen wenn Abteilung wechselt
            if (key === 'department') {
                updated.position = null;
            }
            return updated;
        });
    }

    save() {
        const data = this.employee();

        if (this.isEditMode()) {
            this.employeeService.updateEmployee(data.id!, data).subscribe({
                next: () => this.goBack('Gespeichert!'),
                error: (err) => {
                    console.error(err);
                    this.snackBar.open('Fehler beim Speichern', 'OK');
                },
            });
        } else {
            this.employeeService.createEmployee(data).subscribe({
                next: (response) => {
                    const ref = this.dialog.open(PasswordDialogComponent, {
                        width: '450px',
                        disableClose: true,
                        data: {
                            username: response.initial_username,
                            password: response.initial_password,
                        },
                    });
                    ref.afterClosed().subscribe(() => this.goBack('Mitarbeiter angelegt!'));
                },
                error: (err) => {
                    console.error(err);
                    this.snackBar.open('Fehler beim Speichern', 'OK');
                },
            });
        }
    }

    private goBack(message: string) {
        this.snackBar.open(message, 'Super', { duration: 3000 });
        this.router.navigate(['/list']);
    }
}
