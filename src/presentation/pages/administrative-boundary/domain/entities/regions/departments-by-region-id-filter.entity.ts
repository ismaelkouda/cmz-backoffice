import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

import { DepartmentsByRegionIdFilterVo } from '@presentation/pages/administrative-boundary/domain/value-objects/regions/departments-by-region-id-filter.vo';

export class DepartmentsByRegionIdFilterEntity {
    constructor(
        public readonly uniqId: string,
        public readonly search?: string,
        public readonly region?: string,
        public readonly municipality?: string,
        public readonly status?: string,
        public readonly period?: DatePeriod
    ) {}

    static fromVo(
        vo: DepartmentsByRegionIdFilterVo
    ): DepartmentsByRegionIdFilterEntity {
        return new DepartmentsByRegionIdFilterEntity(
            vo.uniqId,
            vo.search,
            vo.region,
            vo.municipality,
            vo.status,
            vo.period
        );
    }
}
