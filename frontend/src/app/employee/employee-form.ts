import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';

import { EmployeeService, Employee, Department, Position } from '../employee/employee';
import { PasswordDialogComponent } from '../shared/password-dialog';

@Component({
    selector: 'app-employee-form',
    standalone: true,
    imports: [
        CommonModule,
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
    private service = inject(EmployeeService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private snackBar = inject(MatSnackBar);
    private dialog = inject(MatDialog);

    departments = signal<Department[]>([]);
    positions = signal<Position[]>([]);
    isEditMode = signal(false);

    employee = signal<Employee>({
        first_name: '',
        last_name: '',
        email: '',
        department: '',
        position: '',
    });

    ngOnInit() {
        forkJoin([this.service.getDepartments(), this.service.getPositions()]).subscribe(
            ([depts, positions]) => {
                this.departments.set(depts);
                this.positions.set(positions);

                const id = this.route.snapshot.paramMap.get('id');
                if (id) {
                    this.isEditMode.set(true);
                    this.loadEmployee(+id);
                }
            },
        );
    }

    loadEmployee(id: number) {
        this.service.getEmployee(id).subscribe({
            next: (data) => {
                const empData = { ...data };

                if (typeof empData.position === 'number') {
                    const foundPos = this.positions().find((p) => p.id === empData.position);
                    if (foundPos) empData.position = foundPos.title;
                } else if (empData.position && typeof empData.position === 'object') {
                    empData.position = (empData.position as { title: string }).title;
                }

                if (typeof empData.department === 'number') {
                    const foundDept = this.departments().find((d) => d.id === empData.department);
                    if (foundDept) empData.department = foundDept.name;
                } else if (empData.department && typeof empData.department === 'object') {
                    empData.department = (empData.department as { name: string }).name;
                }

                this.employee.set(empData);
            },
            error: (err) => {
                this.snackBar.open('Fehler beim Laden', 'OK');
                console.error(err);
            },
        });
    }

    updateField(key: keyof Employee, value: Employee[keyof Employee]) {
        this.employee.update((current) => ({
            ...current,
            [key]: value,
        }));
    }

    save() {
        const data = this.employee();

        if (this.isEditMode()) {
            this.service.updateEmployee(data.id!, data).subscribe({
                next: () => this.goBack('Gespeichert!'),
                error: (err) => {
                    console.error(err);
                    this.snackBar.open('Fehler beim Speichern', 'OK');
                },
            });
        } else {
            this.service.createEmployee(data).subscribe({
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

    goBack(message: string) {
        this.snackBar.open(message, 'Super', { duration: 3000 });
        this.router.navigate(['/list']);
    }
}
