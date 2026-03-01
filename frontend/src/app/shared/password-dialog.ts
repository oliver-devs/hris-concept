import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface PasswordDialogData {
    username: string;
    password: string;
}

@Component({
    selector: 'app-password-dialog',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule, MatIconModule],
    template: `
        <h2 mat-dialog-title>Mitarbeiter angelegt</h2>

        <mat-dialog-content>
            <p>Bitte notiere die Zugangsdaten. Das Passwort wird nur einmalig angezeigt.</p>

            <div class="credentials">
                <div class="credential-row">
                    <span class="label">Benutzername</span>
                    <code>{{ data.username }}</code>
                </div>
                <div class="credential-row">
                    <span class="label">Initiales Passwort</span>
                    <code>{{ data.password }}</code>
                </div>
            </div>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
            <button mat-flat-button color="primary" (click)="dialogRef.close()">
                Verstanden
            </button>
        </mat-dialog-actions>
    `,
    styles: [
        `
            .credentials {
                background: #f5f5f5;
                border-radius: 8px;
                padding: 16px;
                margin: 16px 0;
            }
            .credential-row {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 10px;
            }
            .credential-row:last-child {
                margin-bottom: 0;
            }
            .label {
                color: #666;
                min-width: 160px;
                font-size: 0.9rem;
            }
            code {
                font-family: monospace;
                font-size: 1rem;
                background: #fff;
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 4px 10px;
                letter-spacing: 0.05em;
            }
        `,
    ],
})
export class PasswordDialogComponent {
    readonly dialogRef = inject(MatDialogRef<PasswordDialogComponent>);
    readonly data = inject<PasswordDialogData>(MAT_DIALOG_DATA);
}
