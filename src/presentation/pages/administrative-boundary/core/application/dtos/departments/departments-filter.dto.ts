export interface DepartmentsFilterDto {
    search?: string;
    regionId?: string;
    municipalityCode?: string;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
}
