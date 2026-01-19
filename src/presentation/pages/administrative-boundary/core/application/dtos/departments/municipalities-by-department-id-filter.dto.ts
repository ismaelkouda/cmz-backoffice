export interface MunicipalitiesByDepartmentIdFilterDto {
    departmentCode: string;
    search?: string;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
}
