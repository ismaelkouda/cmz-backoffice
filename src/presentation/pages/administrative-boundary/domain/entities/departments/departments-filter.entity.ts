import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

import { Status } from '@presentation/pages/administrative-boundary/domain/enums/departments/departments-status.enum';
import { DepartmentsFilterVo } from '@presentation/pages/administrative-boundary/domain/value-objects/departments/departments-filter.vo';

export class DepartmentsFilterEntity {
    constructor(
        public readonly search?: string,
        public readonly region?: string,
        public readonly municipality?: string,
        public readonly status?: Status,
        public readonly period?: DatePeriod
    ) {}

    static fromVo(vo: DepartmentsFilterVo): DepartmentsFilterEntity {
        return new DepartmentsFilterEntity(
            vo?.search,
            vo?.region,
            vo?.municipality,
            vo?.status,
            vo.period
        );
    }

    public clone(
        updates: Partial<DepartmentsFilterEntity>
    ): DepartmentsFilterEntity {
        return new DepartmentsFilterEntity(
            updates.search ?? this.search,
            updates.region ?? this.region,
            updates.municipality ?? this.municipality,
            updates.status ?? this.status,
            updates.period ?? this.period
        );
    }
}
