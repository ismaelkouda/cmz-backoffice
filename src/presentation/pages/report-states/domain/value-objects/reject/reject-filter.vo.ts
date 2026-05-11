import { RejectFilterDto } from '@pages/report-states/application/dto/reject/reject-filter.dto';
import { Status } from '@pages/report-states/domain/enums/reject/reject-status.enum';
import { RejectFilterProps } from '@pages/report-states/domain/interfaces/reject/reject-filter-props.interface';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { normalizePhoneNumber } from '@shared/domain/services/normalize-phone-number';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';
export class RejectFilterVo {
    public readonly initiatorPhoneNumber?: string;
    public readonly uniqId?: string;
    public readonly reportType?: ReportType;
    public readonly operators?: string[];
    public readonly status?: Status;
    public readonly source?: string;
    public readonly period?: DatePeriod;

    private constructor(props: RejectFilterProps) {
        this.initiatorPhoneNumber = props.initiatorPhoneNumber;
        this.uniqId = props.uniqId;
        this.reportType = props.reportType;
        this.operators = props.operators;
        this.status = props.status;
        this.source = props.source;
        this.period = props.period;
    }

    static fromDto(dto: RejectFilterDto | null): RejectFilterVo {
        const initiatorPhoneNumber = normalizePhoneNumber(
            dto?.initiatorPhoneNumber?.trim()
        );
        const uniqId = dto?.uniqId;
        const reportType = dto?.reportType;
        const operators = dto?.operators;
        const status = dto?.status;
        const source = dto?.source;

        let period: DatePeriod | undefined;

        if (dto?.startDate || dto?.endDate) {
            period = DatePeriod.create(dto.startDate, dto.endDate);
        }

        return new RejectFilterVo({
            initiatorPhoneNumber,
            uniqId,
            reportType,
            operators,
            status,
            source,
            period,
        });
    }
}
