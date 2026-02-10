import { DatePeriod } from '@shared/core/domain/value-object/date-period.vo';

import { QueuesFilterVo } from '../../value-objects/queues-filter.vo';

export class QueuesFilterEntity {
    constructor(
        public readonly initiatorPhoneNumber?: string,
        public readonly uniqId?: string,
        public readonly reportType?: string,
        public readonly operators?: string[],
        public readonly source?: string,
        public readonly period?: DatePeriod
    ) {}

    static fromVo(vo: QueuesFilterVo): QueuesFilterEntity {
        return new QueuesFilterEntity(
            vo.initiatorPhoneNumber,
            vo.uniqId,
            vo.reportType,
            vo.operators,
            vo.source,
            vo.period
        );
    }
}
