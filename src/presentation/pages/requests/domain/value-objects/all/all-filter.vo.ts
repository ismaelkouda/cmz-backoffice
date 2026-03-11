import { AllFilterDto } from '@pages/requests/application/dto/all/all-filter.dto';
import { Status } from '@pages/requests/domain/enums/all/all-status.enum';
import { AllFilterProps } from '@pages/requests/domain/interfaces/all/all-filter-props.interface';
import { normalizePhoneNumber } from '@shared/domain/services/normalize-phone-number';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class AllFilterVo {
    public readonly initiatorPhoneNumber?: string;
    public readonly uniqId?: string;
    public readonly reportType?: string;
    public readonly operators?: string[];
    public readonly status?: Status;
    public readonly source?: string;
    public readonly period?: DatePeriod;

    private constructor(props: AllFilterProps) {
        this.initiatorPhoneNumber = props.initiatorPhoneNumber;
        this.uniqId = props.uniqId;
        this.reportType = props.reportType;
        this.operators = props.operators;
        this.status = props.status;
        this.source = props.source;
        this.period = props.period;
    }

    static fromDto(dto: AllFilterDto | null): AllFilterVo {
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

        return new AllFilterVo({
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
