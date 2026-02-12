import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-placeholder',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatIconModule],
    template: `
        <div
            style="padding: 40px; display: flex; justify-content: center; align-items: center; height: 100%;"
        >
            <mat-card style="max-width: 500px; text-align: center; padding: 40px;">
                <mat-icon
                    style="font-size: 64px; height: 64px; width: 64px; color: #ff9800; margin-bottom: 20px;"
                    >construction</mat-icon
                >
                <h1 style="margin: 0 0 10px 0;">{{ title }}</h1>
                <p style="color: grey; font-size: 16px;">
                    Dieses Modul ist derzeit noch in Entwicklung.<br />
                    Funktion demnächst verfügbar.
                </p>
            </mat-card>
        </div>
    `,
})
export class PlaceholderComponent implements OnInit {
    title = 'In Arbeit';
    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.data.subscribe((data) => {
            if (data['title']) this.title = data['title'];
        });
    }
}
