import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

import { Status } from '@presentation/pages/administrative-boundary/domain/enums/municipalities/municipalities-status.enum';
import { MunicipalitiesFilterVo } from '@presentation/pages/administrative-boundary/domain/value-objects/municipalities/municipalities-filter.vo';

export class MunicipalitiesFilterEntity {
    constructor(
        public readonly search?: string,
        public readonly region?: string,
        public readonly department?: string,
        public readonly status?: Status,
        public readonly period?: DatePeriod
    ) {}

    static fromVo(vo: MunicipalitiesFilterVo): MunicipalitiesFilterEntity {
        return new MunicipalitiesFilterEntity(
            vo.search,
            vo.region,
            vo.department,
            vo.status,
            vo.period
        );
    }
}
