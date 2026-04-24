import { Status } from '@pages/requests/domain/enums/all/all-status.enum';
import { AllFilterVo } from '@pages/requests/domain/value-objects/all/all-filter.vo';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class AllFilterEntity {
    constructor(
        public readonly initiatorPhoneNumber?: string,
        public readonly uniqId?: string,
        public readonly reportType?: ReportType,
        public readonly operators?: string[],
        public readonly source?: string,
        public readonly status?: Status,
        public readonly period?: DatePeriod
    ) {}

    static fromVo(vo: AllFilterVo): AllFilterEntity {
        return new AllFilterEntity(
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
