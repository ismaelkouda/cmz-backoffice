import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

import { MunicipalitiesByDepartmentIdFilterVo } from '@presentation/pages/administrative-boundary/domain/value-objects/departments/municipalities-by-department-id-filter.vo';

export class MunicipalitiesByDepartmentIdFilterEntity {
    constructor(
        public readonly uniqId: string,
        public readonly search?: string,
        public readonly region?: string,
        public readonly department?: string,
        public readonly status?: string,
        public readonly period?: DatePeriod
    ) {}

    static fromVo(
        vo: MunicipalitiesByDepartmentIdFilterVo
    ): MunicipalitiesByDepartmentIdFilterEntity {
        return new MunicipalitiesByDepartmentIdFilterEntity(
            vo.uniqId,
            vo.search,
            vo.region,
            vo.department,
            vo.status,
            vo.period
        );
    }
}
