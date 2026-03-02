import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

import { Status } from '@presentation/pages/administrative-boundary/domain/enums/regions/regions-status.enum';
import { RegionsFilterVo } from '@presentation/pages/administrative-boundary/domain/value-objects/regions/regions-filter.vo';

export class RegionsFilterEntity {
    constructor(
        public readonly search?: string,
        public readonly department?: string,
        public readonly municipality?: string,
        public readonly status?: Status,
        public readonly period?: DatePeriod
    ) {}

    static fromVo(vo: RegionsFilterVo): RegionsFilterEntity {
        return new RegionsFilterEntity(
            vo?.search,
            vo?.department,
            vo?.municipality,
            vo?.status,
            vo.period
        );
    }

    public clone(updates: Partial<RegionsFilterEntity>): RegionsFilterEntity {
        return new RegionsFilterEntity(
            updates.search ?? this.search,
            updates.department ?? this.department,
            updates.municipality ?? this.municipality,
            updates.status ?? this.status,
            updates.period ?? this.period
        );
    }
}
