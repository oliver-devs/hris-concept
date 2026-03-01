import { Routes } from '@angular/router';
import { PlaceholderComponent } from './shared/placeholder';
import { DashboardComponent } from './dashboard/dashboard';
import { DepartmentListComponent } from './department/department-list';
import { EmployeeListComponent } from './employee/employee-list';
import { EmployeeFormComponent } from './employee/employee-form';
import { LoginComponent } from './login/login';
import { SettingsComponent } from './settings/settings';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
        data: { title: 'Dashboard Übersicht' },
    },
    {
        path: 'analytics',
        component: PlaceholderComponent,
        canActivate: [authGuard],
        data: { title: 'Statistiken & Reports' },
    },
    {
        path: 'list',
        component: EmployeeListComponent,
        canActivate: [authGuard],
    },
    {
        path: 'create',
        component: EmployeeFormComponent,
        canActivate: [authGuard],
    },
    {
        path: 'edit/:id',
        component: EmployeeFormComponent,
        canActivate: [authGuard],
    },
    {
        path: 'org-chart',
        component: PlaceholderComponent,
        canActivate: [authGuard],
        data: { title: 'Organigramm' },
    },
    {
        path: 'calendar',
        component: PlaceholderComponent,
        canActivate: [authGuard],
        data: { title: 'Urlaubsplaner & Kalender' },
    },
    {
        path: 'time-tracking',
        component: PlaceholderComponent,
        canActivate: [authGuard],
        data: { title: 'Zeiterfassung & Arbeitszeiten' },
    },
    {
        path: 'documents',
        component: PlaceholderComponent,
        canActivate: [authGuard],
        data: { title: 'Dokumentenverwaltung' },
    },
    {
        path: 'applicants',
        component: PlaceholderComponent,
        canActivate: [authGuard],
        data: { title: 'Bewerberverwaltung' },
    },
    {
        path: 'departments',
        component: DepartmentListComponent,
        canActivate: [authGuard],
    },
    {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [authGuard],
        data: { title: 'System Einstellungen' },
    },

    { path: '**', redirectTo: 'dashboard' },
];
