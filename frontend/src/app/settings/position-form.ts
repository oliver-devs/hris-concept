import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService, Position } from '../employee/employee';

@Component({
    selector: 'app-position-form',
    imports: [FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    templateUrl: './position-form.html',
    styleUrl: './position-form.css',
})
export class PositionFormComponent {
    private readonly service = inject(EmployeeService);
    private readonly ref = inject(MatDialogRef<PositionFormComponent>);
    private readonly snackBar = inject(MatSnackBar);
    private readonly data = inject<Position>(MAT_DIALOG_DATA, { optional: true });

    readonly isEditMode = signal(false);
    pos: Partial<Position> = { title: '' };

    constructor() {
        if (this.data) {
            this.pos = { ...this.data };
            this.isEditMode.set(true);
        }
    }

    save() {
        if (this.isEditMode()) {
            this.service.updatePosition(this.pos.id!, this.pos).subscribe(() => {
                this.ref.close(true);
            });
        } else {
            this.service.createPosition(this.pos.title!).subscribe({
                next: () => this.ref.close(true),
                error: (err) => {
                    console.error(err);
                    this.snackBar.open('Fehler beim Erstellen der Position.', 'OK', { duration: 4000 });
                },
            });
        }
    }
}
