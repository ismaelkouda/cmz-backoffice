import { CloseFilterVo } from '@pages/report-states/domain/value-objects/close/close-filter.vo';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class CloseFilterEntity {
    constructor(
        public readonly initiatorPhoneNumber?: string,
        public readonly uniqId?: string,
        public readonly reportType?: ReportType,
        public readonly operators?: string[],
        public readonly source?: string,
        public readonly period?: DatePeriod
    ) {}

    static fromVo(vo: CloseFilterVo): CloseFilterEntity {
        return new CloseFilterEntity(
            vo.initiatorPhoneNumber,
            vo.uniqId,
            vo.reportType,
            vo.operators,
            vo.source,
            vo.period
        );
    }
}
