import { Status } from '@pages/report-states/domain/enums/reject/reject-status.enum';
import { RejectFilterVo } from '@pages/report-states/domain/value-objects/reject/reject-filter.vo';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class RejectFilterEntity {
    constructor(
        public readonly initiatorPhoneNumber?: string,
        public readonly uniqId?: string,
        public readonly reportType?: ReportType,
        public readonly operators?: string[],
        public readonly source?: string,
        public readonly status?: Status,
        public readonly period?: DatePeriod
    ) {}

    static fromVo(vo: RejectFilterVo): RejectFilterEntity {
        return new RejectFilterEntity(
            vo.initiatorPhoneNumber,
            vo.uniqId,
            vo.reportType,
            vo.operators,
            vo.source,
            vo.status,
            vo.period
        );
    }
}
