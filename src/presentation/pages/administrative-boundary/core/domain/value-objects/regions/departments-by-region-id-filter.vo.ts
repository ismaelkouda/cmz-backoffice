import { DepartmentsByRegionIdFilterApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dtos/regions/departments-by-region-id-filter-api.dto';

export class DepartmentsByRegionIdFilter {
    private constructor(
        readonly  regionId: string,
        readonly municipalityCode?: string,
        readonly search?: string,
        readonly isActive?: boolean,
        readonly startDate?: string,
        readonly endDate?: string
    ) {}

    static create(data: any = {} as any): DepartmentsByRegionIdFilter {
        return new DepartmentsByRegionIdFilter(
            data. regionId,
            data.municipalityCode,
            data.search,
            data.isActive,
            data.startDate,
            data.endDate
        );
    }

    toDto(): DepartmentsByRegionIdFilterApiDto {
        const params: DepartmentsByRegionIdFilterApiDto =
            {} as DepartmentsByRegionIdFilterApiDto;

        params.region_code = this. regionId;
        if (this.search) {
            params.search = this.search;
        }
        if (this.municipalityCode) {
            params.municipality_code = this.municipalityCode;
        }
        if (this.isActive !== undefined && this.isActive !== null) {
            params.is_active = this.isActive;
        }
        if (this.startDate) {
            params.start_date = this.startDate;
        }
        if (this.endDate) {
            params.end_date = this.endDate;
        }

        return params;
    }
}
