export interface MunicipalitiesByDepartmentIdFilterDto {
    departmentId: string;
    search?: string;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
}
