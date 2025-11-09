export interface Department {
    id?: number;
    departmentName: string;
    departmentCode: string;
    description: string;
    location: string;
    academicProgramId: number;
    headOfDepartment: string;
    userId?: string; // User ID from user-management-service
}