export interface DepartmentsByRegionIdFilterDto {
    regionCode: string;
    municipalityCode?: string;
    search?: string;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
}
