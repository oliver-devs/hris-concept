import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmDialogData {
    title: string;
    message: string;
}

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
    template: `
        <h2 mat-dialog-title>{{ data.title }}</h2>

        <mat-dialog-content>
            <p>{{ data.message }}</p>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
            <button mat-button (click)="dialogRef.close(false)">Abbrechen</button>
            <button mat-flat-button color="warn" (click)="dialogRef.close(true)">Löschen</button>
        </mat-dialog-actions>
    `,
})
export class ConfirmDialogComponent {
    readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
    readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
}
