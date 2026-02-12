import { Component, inject, signal } from '@angular/core'; // signal dazu
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { EmployeeService, Department } from '../employee/employee';

@Component({
    selector: 'app-department-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
    ],
    templateUrl: './department-form.html',
    styleUrl: './department-form.css',
})
export class DepartmentFormComponent {
    // Services injizieren (Modern Style)
    private service = inject(EmployeeService);
    private ref = inject(MatDialogRef<DepartmentFormComponent>);
    private data = inject<Department>(MAT_DIALOG_DATA, { optional: true });

    // STATE als Signal
    isEditMode = signal(false);

    // FORM DATEN als normales Objekt (Besser für [(ngModel)])
    dept: Department = { name: '', description: '' };

    constructor() {
        if (this.data) {
            this.dept = { ...this.data };
            // Signal setzen
            this.isEditMode.set(true);
        }
    }

    save() {
        // Signal lesen mit ()
        if (this.isEditMode()) {
            this.service.updateDepartment(this.dept.id!, this.dept).subscribe(() => {
                this.ref.close(true);
            });
        } else {
            this.service.createDepartment(this.dept).subscribe(() => {
                this.ref.close(true);
            });
        }
    }
}
