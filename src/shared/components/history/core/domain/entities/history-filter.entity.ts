import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

import { HistoryFilterVo } from '../value-objects/history-filter.vo';

export class HistoryFilterEntity {
    constructor(
        public readonly search?: string,
        public readonly period?: DatePeriod
    ) {}

    static fromVo(vo: HistoryFilterVo): HistoryFilterEntity {
        return new HistoryFilterEntity(vo.search, vo.period);
    }
}
