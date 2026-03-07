import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';

import { EmployeeService } from '../shared/employee.service';
import { Employee } from '../shared/models';
import { ConfirmDialogComponent } from '../shared/confirm-dialog';
import { AuthService } from '../auth/auth.service';

interface EmployeeGroup {
    name: string;
    employees: Employee[];
}

interface AlphabeticalPositionGroup {
    letter: string;
    positions: EmployeeGroup[];
}

@Component({
    selector: 'app-employee-list',
    imports: [
        MatButtonModule,
        MatIconModule,
        RouterModule,
        MatFormFieldModule,
        MatInputModule,
        MatTooltipModule,
        MatButtonToggleModule,
        MatExpansionModule,
        MatCardModule,
    ],
    templateUrl: './employee-list.html',
    styleUrl: './employee-list.css',
})
export class EmployeeListComponent implements OnInit {
    private readonly service = inject(EmployeeService);
    private readonly snackBar = inject(MatSnackBar);
    private readonly dialog = inject(MatDialog);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    readonly auth = inject(AuthService);

    readonly employees = signal<Employee[]>([]);
    readonly searchQuery = signal('');
    readonly currentView = signal<'department' | 'position'>('department');
    readonly selectedLetter = signal<string | null>(null);

    private readonly filteredEmployees = computed(() => {
        const query = this.searchQuery().toLowerCase().trim();
        const list = this.employees();
        if (!query) return list;

        return list.filter((emp) => {
            const first = (emp.first_name || '').toLowerCase();
            const last = (emp.last_name || '').toLowerCase();
            const email = (emp.email || '').toLowerCase();
            const dept = (emp.department_name || '').toLowerCase();
            const pos = (emp.position_title || '').toLowerCase();

            return (
                first.includes(query) ||
                last.includes(query) ||
                email.includes(query) ||
                dept.includes(query) ||
                pos.includes(query)
            );
        });
    });

    readonly departmentGroups = computed(() =>
        this.groupBy(this.filteredEmployees(), (emp) => emp.department_name || 'Ohne Abteilung'),
    );

    readonly alphabeticalDepartmentGroups = computed<AlphabeticalPositionGroup[]>(() => {
        const departments = this.departmentGroups();
        const groupedByLetter = new Map<string, EmployeeGroup[]>();

        for (const dept of departments) {
            let letter = dept.name.charAt(0).toUpperCase();
            if (!/[A-Z]/.test(letter)) {
                letter = '#';
            }

            if (!groupedByLetter.has(letter)) {
                groupedByLetter.set(letter, []);
            }
            groupedByLetter.get(letter)!.push(dept);
        }

        return [...groupedByLetter.entries()]
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([letter, positions]) => ({ letter, positions }));
    });

    private readonly positionGroups = computed(() =>
        this.groupBy(this.filteredEmployees(), (emp) => emp.position_title || 'Ohne Position'),
    );

    readonly alphabeticalPositionGroups = computed<AlphabeticalPositionGroup[]>(() => {
        const positions = this.positionGroups();
        const groupedByLetter = new Map<string, EmployeeGroup[]>();

        for (const pos of positions) {
            let letter = pos.name.charAt(0).toUpperCase();
            // Handle edge case where name might start with special char or number
            if (!/[A-Z]/.test(letter)) {
                letter = '#';
            }

            if (!groupedByLetter.has(letter)) {
                groupedByLetter.set(letter, []);
            }
            groupedByLetter.get(letter)!.push(pos);
        }

        return [...groupedByLetter.entries()]
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([letter, positions]) => ({ letter, positions }));
    });

    readonly availableLetters = computed(() => {
        const groups = this.currentView() === 'department'
            ? this.alphabeticalDepartmentGroups()
            : this.alphabeticalPositionGroups();
        return groups.map((g) => g.letter);
    });

    readonly filteredAlphabeticalDepartmentGroups = computed(() => {
        const groups = this.alphabeticalDepartmentGroups();
        const letter = this.selectedLetter();
        return letter ? groups.filter((g) => g.letter === letter) : groups;
    });

    readonly filteredAlphabeticalPositionGroups = computed(() => {
        const groups = this.alphabeticalPositionGroups();
        const letter = this.selectedLetter();
        return letter ? groups.filter((g) => g.letter === letter) : groups;
    });

    readonly totalFiltered = computed(() => this.filteredEmployees().length);

    ngOnInit() {
        this.loadEmployees();
        this.route.queryParams.subscribe(params => {
            const view = params['view'];
            if (view === 'department' || view === 'position') {
                this.currentView.set(view);
            }
        });
    }

    setView(view: 'department' | 'position') {
        this.currentView.set(view);
        this.selectedLetter.set(null);
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { view },
            queryParamsHandling: 'merge',
        });
    }

    toggleLetter(letter: string) {
        if (this.selectedLetter() === letter) {
            this.selectedLetter.set(null);
        } else {
            this.selectedLetter.set(letter);
        }
    }

    loadEmployees() {
        this.service.getEmployees().subscribe({
            next: (data) => this.employees.set(data),
            error: (err) => console.error(err),
        });
    }

    deleteEmployee(id: number | undefined) {
        if (!id) return;

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            data: {
                title: 'Mitarbeiter löschen?',
                message: 'Möchtest du diesen Mitarbeiter wirklich unwiderruflich entfernen?',
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === true) {
                this.service.deleteEmployee(id).subscribe(() => {
                    this.loadEmployees();
                    this.snackBar.open('Gelöscht.', 'OK', { duration: 3000 });
                });
            }
        });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.searchQuery.set(filterValue);
    }

    private groupBy(list: Employee[], keyFn: (emp: Employee) => string): EmployeeGroup[] {
        const groups = new Map<string, Employee[]>();
        for (const emp of list) {
            const key = keyFn(emp);
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key)!.push(emp);
        }
        return [...groups.entries()]
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([name, employees]) => ({ name, employees }));
    }
}
