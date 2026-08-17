import { QueuesFilterDto } from '@pages/finalization/application/dto/queues/queues-filter.dto';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { normalizePhoneNumber } from '@shared/domain/services/normalize-phone-number';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class QueuesFilterVo {
    public readonly initiatorPhoneNumber?: string;
    public readonly uniqId?: string;
    public readonly reportType?: ReportType;
    public readonly operators?: string[];
    public readonly source?: string;
    public readonly period?: DatePeriod;

    private constructor(props: {
        initiatorPhoneNumber?: string;
        uniqId?: string;
        reportType?: ReportType;
        operators?: string[];
        source?: string;
        period?: DatePeriod;
    }) {
        this.initiatorPhoneNumber = props.initiatorPhoneNumber;
        this.uniqId = props.uniqId;
        this.reportType = props.reportType;
        this.operators = props.operators;
        this.operators = props.operators;
        this.source = props.source;
        this.period = props.period;
    }

    static fromDto(dto: QueuesFilterDto | null): QueuesFilterVo {
        const initiatorPhoneNumber = normalizePhoneNumber(
            dto?.initiatorPhoneNumber?.trim()
        );
        const uniqId = dto?.uniqId?.trim();
        const reportType = dto?.reportType;
        const operators = dto?.operators;
        const source = dto?.source?.trim();

        let period: DatePeriod | undefined;

        if (dto?.startDate || dto?.endDate) {
            period = DatePeriod.create(dto.startDate, dto.endDate);
        }

        return new QueuesFilterVo({
            initiatorPhoneNumber,
            uniqId,
            reportType,
            operators,
            source,
            period,
        });
    }
}
