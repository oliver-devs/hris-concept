export interface Position {
    id: number;
    department: number;
    title: string;
    description?: string;
    is_management?: boolean;
    can_approve?: boolean;
    requires_dual_approval?: boolean;
    employee_count?: number;
}

export interface Department {
    id?: number;
    name: string;
    description: string;
    employee_count?: number;
    position_count?: number;
}

export interface Employee {
    id?: number;
    first_name: string;
    last_name: string;
    email: string;
    department: number;
    department_name?: string;
    position?: number | null;
    position_title?: string | null;
}

export interface Absence {
    id?: number;
    employee: number;
    employee_name?: string;
    absence_type: 'vacation' | 'sick' | 'homeoffice' | 'other';
    start_date: string;
    end_date: string;
    note?: string;
    status?: 'pending' | 'approved' | 'denied';
    approvals_required?: number;
    approved_by_names?: string[];
    approval_count?: number;
    created_at?: string;
}

export interface CreateEmployeeResponse extends Employee {
    initial_username: string;
    initial_password: string;
}
