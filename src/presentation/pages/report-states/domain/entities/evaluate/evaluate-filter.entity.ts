import { EvaluateFilterVo } from '@pages/report-states/domain/value-objects/evaluate/evaluate-filter.vo';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class EvaluateFilterEntity {
    constructor(
        public readonly initiatorPhoneNumber?: string,
        public readonly uniqId?: string,
        public readonly reportType?: ReportType,
        public readonly operators?: string[],
        public readonly source?: string,
        public readonly period?: DatePeriod
    ) {}

    static fromVo(vo: EvaluateFilterVo): EvaluateFilterEntity {
        return new EvaluateFilterEntity(
            vo.initiatorPhoneNumber,
            vo.uniqId,
            vo.reportType,
            vo.operators,
            vo.source,
            vo.period
        );
    }
}
