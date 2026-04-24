import { AllFilterVo } from '@pages/finalization/domain/value-objects/all/all-filter.vo';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class AllFilterEntity {
    constructor(
        public readonly initiatorPhoneNumber?: string,
        public readonly uniqId?: string,
        public readonly reportType?: ReportType,
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
