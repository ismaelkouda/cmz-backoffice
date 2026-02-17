import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

import { AllFilterVo } from '@presentation/pages/processing/domain/value-objects/all/all-filter.vo';

export class AllFilterEntity {
    constructor(
        public readonly initiatorPhoneNumber?: string,
        public readonly uniqId?: string,
        public readonly reportType?: string,
        public readonly operators?: string[],
        public readonly source?: string,
        public readonly state?: string,
        public readonly period?: DatePeriod
    ) {}

    static fromVo(vo: AllFilterVo): AllFilterEntity {
        return new AllFilterEntity(
            vo.initiatorPhoneNumber,
            vo.uniqId,
            vo.reportType,
            vo.operators,
            vo.source,
            vo.state,
            vo.period
        );
    }
}
