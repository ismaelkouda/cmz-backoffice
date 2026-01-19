export interface DepartmentsByRegionIdFilterDto {
    regionCode: string;
    municipalityId?: string;
    search?: string;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
}
