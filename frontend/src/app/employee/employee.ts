import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Position {
    id: number;
    title: string;
    description?: string;
    group?: number;
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

export interface CreateEmployeeResponse extends Employee {
    initial_username: string;
    initial_password: string;
}

@Injectable({
    providedIn: 'root',
})
export class EmployeeService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;

    getEmployees() {
        return this.http.get<Employee[]>(`${this.apiUrl}employees/`);
    }

    getEmployee(id: number) {
        return this.http.get<Employee>(`${this.apiUrl}employees/${id}/`);
    }

    createEmployee(employee: Employee) {
        return this.http.post<CreateEmployeeResponse>(`${this.apiUrl}employees/`, employee);
    }

    updateEmployee(id: number, employee: Employee) {
        return this.http.put<Employee>(`${this.apiUrl}employees/${id}/`, employee);
    }

    deleteEmployee(id: number) {
        return this.http.delete<void>(`${this.apiUrl}employees/${id}/`);
    }

    getDepartments() {
        return this.http.get<Department[]>(`${this.apiUrl}departments/`);
    }

    createDepartment(dept: Department) {
        return this.http.post<Department>(`${this.apiUrl}departments/`, dept);
    }

    updateDepartment(id: number, dept: Department) {
        return this.http.put<Department>(`${this.apiUrl}departments/${id}/`, dept);
    }

    deleteDepartment(id: number) {
        return this.http.delete<void>(`${this.apiUrl}departments/${id}/`);
    }

    getPositions() {
        return this.http.get<Position[]>(`${this.apiUrl}positions/`);
    }

    createPosition(title: string) {
        return this.http.post<Position>(`${this.apiUrl}positions/`, { title });
    }

    deletePosition(id: number) {
        return this.http.delete<void>(`${this.apiUrl}positions/${id}/`);
    }

    updatePosition(id: number, position: Partial<Position>) {
        return this.http.put<Position>(`${this.apiUrl}positions/${id}/`, position);
    }
}
