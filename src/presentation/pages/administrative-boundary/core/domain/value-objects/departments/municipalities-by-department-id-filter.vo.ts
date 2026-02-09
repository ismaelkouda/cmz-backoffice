import { MunicipalitiesByDepartmentIdFilterApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dtos/departments/municipalities-by-department-id-filter-api.dto';

export class MunicipalitiesByDepartmentIdFilter {
    private constructor(
        readonly departmentId: string,
        readonly search?: string,
        readonly isActive?: boolean,
        readonly startDate?: string,
        readonly endDate?: string
    ) {}

    static create(data: any = {} as any): MunicipalitiesByDepartmentIdFilter {
        return new MunicipalitiesByDepartmentIdFilter(
            data.departmentId,
            data.search,
            data.isActive,
            data.startDate,
            data.endDate
        );
    }

    toDto(): MunicipalitiesByDepartmentIdFilterApiDto {
        const params: MunicipalitiesByDepartmentIdFilterApiDto =
            {} as MunicipalitiesByDepartmentIdFilterApiDto;

        params.department_code = this.departmentId;
        if (this.search) {
            params['search'] = this.search;
        }
        if (this.isActive !== undefined && this.isActive !== null) {
            params['is_active'] = this.isActive;
        }
        if (this.startDate) {
            params['start_date'] = this.startDate;
        }
        if (this.endDate) {
            params['end_date'] = this.endDate;
        }

        return params;
    }
}
