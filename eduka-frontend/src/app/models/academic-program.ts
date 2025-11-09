export interface AcademicProgram {
    id?: number;
    programName: string;
    programCode: string;
    description: string;
    duration: string;
    isActive: boolean;
    userId?: string; // User ID from user-management service
}