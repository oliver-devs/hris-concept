import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// --- INTERFACES (Datenmodelle) ---

export interface Position {
    id: number;
    title: string;
    description?: string;
    group?: number; // Die ID der Django-Gruppe
}

export interface Department {
    id?: number;
    name: string;
    description: string;
    employee_count?: number;
}

export interface Employee {
    id?: number;
    first_name: string;
    last_name: string;
    email: string;
    department: string | number;
    position?: string | number;
    is_approved?: boolean;
}

// --- SERVICE ---

@Injectable({
    providedIn: 'root',
})
export class EmployeeService {
    // Modern: HttpClient per inject() holen
    private http = inject(HttpClient);

    // Basis-URL als Konstante (readonly)
    private readonly apiUrl = 'http://127.0.0.1:8000/api/';

    // --- EMPLOYEES ---
    getEmployees(): Observable<Employee[]> {
        return this.http.get<Employee[]>(`${this.apiUrl}employees/`);
    }

    getEmployee(id: number): Observable<Employee> {
        return this.http.get<Employee>(`${this.apiUrl}employees/${id}/`);
    }

    createEmployee(employee: Employee): Observable<Employee> {
        return this.http.post<Employee>(`${this.apiUrl}employees/`, employee);
    }

    updateEmployee(id: number, employee: Employee): Observable<Employee> {
        return this.http.put<Employee>(`${this.apiUrl}employees/${id}/`, employee);
    }

    deleteEmployee(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}employees/${id}/`);
    }

    // --- DEPARTMENTS ---
    getDepartments(): Observable<Department[]> {
        return this.http.get<Department[]>(`${this.apiUrl}departments/`);
    }

    createDepartment(dept: Department): Observable<Department> {
        return this.http.post<Department>(`${this.apiUrl}departments/`, dept);
    }

    updateDepartment(id: number, dept: Department): Observable<Department> {
        return this.http.put<Department>(`${this.apiUrl}departments/${id}/`, dept);
    }

    deleteDepartment(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}departments/${id}/`);
    }

    // --- POSITIONS ---
    getPositions(): Observable<Position[]> {
        return this.http.get<Position[]>(`${this.apiUrl}positions/`);
    }
}
