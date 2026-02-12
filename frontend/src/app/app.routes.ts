import { Routes } from '@angular/router';
import { PlaceholderComponent } from './shared/placeholder';
import { DashboardComponent } from './dashboard/dashboard';
import { DepartmentListComponent } from './department/department-list';
import { EmployeeListComponent } from './employee/employee-list';
import { EmployeeFormComponent } from './employee/employee-form';
import { LoginComponent } from './login/login'; // <--- IMPORT
import { authGuard } from './auth.guard'; // <--- IMPORT

export const routes: Routes = [
    // Login Seite (darf jeder sehen)
    { path: 'login', component: LoginComponent },

    // Startseite -> Dashboard
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: 'dashboard',
        component: DashboardComponent,
        data: { title: 'Dashboard Übersicht' },
    },
    { path: 'list', component: EmployeeListComponent },
    { path: 'create', component: EmployeeFormComponent },
    { path: 'edit/:id', component: EmployeeFormComponent },
    {
        path: 'departments',
        component: DepartmentListComponent,
    },
    {
        path: 'calendar',
        component: PlaceholderComponent,
        data: { title: 'Urlaubsplaner & Kalender' },
    },
    {
        path: 'analytics',
        component: PlaceholderComponent,
        data: { title: 'Statistiken & Reports' },
    },
    {
        path: 'settings',
        component: PlaceholderComponent,
        data: { title: 'System Einstellungen' },
    },
];
