export interface DepartmentsFilterDto {
    search?: string;
    regionCode?: string;
    municipalityCode?: string;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
}
