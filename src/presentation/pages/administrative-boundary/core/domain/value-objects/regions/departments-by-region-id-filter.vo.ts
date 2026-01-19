import { DepartmentsByRegionIdFilterApiDto } from "@presentation/pages/administrative-boundary/infrastructure/api/dtos/regions/departments-by-region-id-filter-api.dto";

export class DepartmentsByRegionIdFilter {
    private constructor(
        readonly regionCode: string,
        readonly municipalityId?: string,
        readonly search?: string,
        readonly isActive?: boolean,
        readonly startDate?: string,
        readonly endDate?: string,
    ) { }

    static create(data: any = {} as any): DepartmentsByRegionIdFilter {
        return new DepartmentsByRegionIdFilter(
            data.regionCode,
            data.municipalityId,
            data.search,
            data.isActive,
            data.startDate,
            data.endDate,
        );
    }

    toDto(): DepartmentsByRegionIdFilterApiDto {
        const params: DepartmentsByRegionIdFilterApiDto = {} as DepartmentsByRegionIdFilterApiDto;

        params.region_code = this.regionCode;
        if (this.search) params.search = this.search;
        if (this.municipalityId) params.municipality_id = this.municipalityId;
        if (this.isActive !== undefined && this.isActive !== null) params.is_active = this.isActive;
        if (this.startDate) params.start_date = this.startDate;
        if (this.endDate) params.end_date = this.endDate;

        return params;
    }
}
