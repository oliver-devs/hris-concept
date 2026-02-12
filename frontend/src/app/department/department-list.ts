import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService, Department } from '../employee/employee';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DepartmentFormComponent } from './department-form';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-department-list',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatDialogModule],
    templateUrl: './department-list.html',
    styleUrl: './department-list.css',
})
export class DepartmentListComponent implements OnInit {
    // Services per inject() holen
    private service = inject(EmployeeService);
    private dialog = inject(MatDialog);
    private snackBar = inject(MatSnackBar);

    // Daten als Signal (Initialwert leeres Array)
    departments = signal<Department[]>([]);

    ngOnInit() {
        this.load();
    }

    load() {
        this.service.getDepartments().subscribe((data) => {
            // Signal updaten -> UI aktualisiert sich automatisch
            this.departments.set(data);
        });
    }

    openForm(dept?: Department) {
        const ref = this.dialog.open(DepartmentFormComponent, {
            width: '400px',
            data: dept, // undefined bei "Neu", Objekt bei "Bearbeiten"
        });

        ref.afterClosed().subscribe((result) => {
            if (result === true) {
                this.load(); // Liste neu laden
                this.snackBar.open(dept ? 'Gespeichert!' : 'Erstellt!', 'OK', { duration: 3000 });
            }
        });
    }

    deleteDept(dept: Department) {
        // Prüfung: Darf nicht gelöscht werden, wenn Mitarbeiter drin sind
        if (dept.employee_count && dept.employee_count > 0) {
            this.snackBar.open(`Fehler: "${dept.name}" ist nicht leer!`, 'OK');
            return;
        }

        if (confirm(`Abteilung "${dept.name}" löschen?`)) {
            this.service.deleteDepartment(dept.id!).subscribe(() => {
                this.load();
                this.snackBar.open('Gelöscht.', 'OK', { duration: 3000 });
            });
        }
    }
}
