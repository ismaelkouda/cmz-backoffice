import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

import { HistoryFilterVo } from '../value-objects/history-filter.vo';

export class HistoryFilterEntity {
    constructor(
        public readonly search?: string,
        public readonly period?: DatePeriod,
        public readonly typeModel?: string,
        public readonly module?: string
    ) {}

    static fromVo(vo: HistoryFilterVo): HistoryFilterEntity {
        return new HistoryFilterEntity(
            vo.search,
            vo.period,
            vo.typeModel,
            vo.module
        );
    }
}
