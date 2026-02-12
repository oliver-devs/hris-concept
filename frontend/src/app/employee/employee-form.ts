import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { EmployeeService, Employee, Department, Position } from '../employee/employee';

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
    // Services per inject()
    private service = inject(EmployeeService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private snackBar = inject(MatSnackBar);

    // SIGNALS für UI-Status und Listen
    departments = signal<Department[]>([]);
    positions = signal<Position[]>([]);
    isEditMode = signal(false);

    // MUTABLE Objekt für das Formular (wg. [(ngModel)])
    employee: Employee = {
        first_name: '',
        last_name: '',
        email: '',
        department: '',
        position: '',
    };

    ngOnInit() {
        // Wir laden die Listen nacheinander, damit sie verfügbar sind,
        // wenn wir den Mitarbeiter laden (wichtig für die Zuordnung).

        // 1. Abteilungen laden
        this.service.getDepartments().subscribe((depts) => {
            this.departments.set(depts);

            // 2. Positionen laden
            this.service.getPositions().subscribe((pos) => {
                this.positions.set(pos);

                // 3. Prüfen auf Edit-Modus
                const id = this.route.snapshot.paramMap.get('id');
                if (id) {
                    this.isEditMode.set(true);
                    this.loadEmployee(+id);
                }
            });
        });
    }

    loadEmployee(id: number) {
        this.service.getEmployee(id).subscribe({
            next: (data) => {
                this.employee = data;

                // --- MAPPING LOGIK (ID zu Name/Titel) ---
                // Das Backend sendet IDs, das Formular braucht aber die Namen/Titel (String),
                // weil die Dropdowns [value]="dept.name" nutzen.

                // 1. Position fixen
                if (typeof this.employee.position === 'number') {
                    const foundPos = this.positions().find((p) => p.id === this.employee.position);
                    if (foundPos) this.employee.position = foundPos.title;
                } else if (this.employee.position && typeof this.employee.position === 'object') {
                    this.employee.position = (this.employee.position as any).title;
                }

                // 2. Abteilung fixen
                if (typeof this.employee.department === 'number') {
                    const foundDept = this.departments().find(
                        (d) => d.id === this.employee.department,
                    );
                    if (foundDept) this.employee.department = foundDept.name;
                } else if (
                    this.employee.department &&
                    typeof this.employee.department === 'object'
                ) {
                    this.employee.department = (this.employee.department as any).name;
                }

                // Hinweis: Da "employee" kein Signal ist, erkennt Angular die Änderung
                // durch das Async-Update manchmal nicht sofort. Da wir aber ngModel nutzen,
                // sollte es klappen. Falls nicht, wäre hier der einzige Ort, wo man tricksen müsste,
                // aber normalerweise reicht das normale Binding.
            },
            error: (err) => {
                this.snackBar.open('Fehler beim Laden des Mitarbeiters', 'OK');
                console.error(err);
            },
        });
    }

    save() {
        const method = this.isEditMode()
            ? this.service.updateEmployee(this.employee.id!, this.employee)
            : this.service.createEmployee(this.employee);

        method.subscribe({
            next: () => this.goBack(this.isEditMode() ? 'Gespeichert!' : 'Mitarbeiter angelegt!'),
            error: (err) => {
                console.error(err);
                this.snackBar.open('Fehler beim Speichern (siehe Konsole)', 'OK', {
                    duration: 3000,
                });
            },
        });
    }

    goBack(message: string) {
        this.snackBar.open(message, 'Super', { duration: 3000 });
        this.router.navigate(['/list']);
    }
}
