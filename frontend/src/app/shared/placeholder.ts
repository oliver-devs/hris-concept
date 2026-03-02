import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-placeholder',
    imports: [MatCardModule, MatIconModule],
    template: `
        <div class="placeholder-container">
            <mat-card class="placeholder-card">
                <mat-icon class="placeholder-icon">construction</mat-icon>
                <h1 class="placeholder-title">{{ title }}</h1>
                <p class="placeholder-text">
                    Dieses Modul ist derzeit noch in Entwicklung.<br />
                    Funktion demnächst verfügbar.
                </p>
            </mat-card>
        </div>
    `,
    styles: `
        .placeholder-container {
            padding: 40px;
            display: grid;
            place-items: center;
            height: 100%;
        }

        .placeholder-card {
            max-width: 500px;
            text-align: center;
            padding: 40px;
        }

        .placeholder-icon {
            font-size: 64px;
            height: 64px;
            width: 64px;
            color: #ff9800;
            margin-block-end: 20px;
        }

        .placeholder-title {
            margin: 0 0 10px;
        }

        .placeholder-text {
            color: grey;
            font-size: 16px;
        }
    `,
})
export class PlaceholderComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);

    title = 'In Arbeit';

    ngOnInit() {
        this.route.data.subscribe((data) => {
            if (data['title']) this.title = data['title'];
        });
    }
}
