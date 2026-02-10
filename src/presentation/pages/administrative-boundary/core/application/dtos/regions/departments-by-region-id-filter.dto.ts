export interface DepartmentsByRegionIdFilterDto {
    regionId: string;
    municipalityCode?: string;
    search?: string;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
}
