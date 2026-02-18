import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

import { MessagingFilterDto } from '@presentation/pages/communication/application/dto/messaging/messaging-filter.dto';

export class MessagingFilterVo {
    public readonly reportId?: string;
    public readonly search?: string;
    public readonly targetType?: string;
    public readonly region?: string;
    public readonly department?: string;
    public readonly municipality?: string;
    public readonly channels?: string[];
    public readonly period?: DatePeriod;

    constructor(props: {
        reportId?: string;
        search?: string;
        targetType?: string;
        region?: string;
        department?: string;
        municipality?: string;
        channels?: string[];
        period?: DatePeriod;
    }) {
        this.reportId = props.reportId;
        this.search = props.search;
        this.targetType = props.targetType;
        this.region = props.region;
        this.department = props.department;
        this.municipality = props.municipality;
        this.channels = props.channels;
        this.period = props.period;
    }

    static fromDto(
        dto: MessagingFilterDto | null = {} as MessagingFilterDto
    ): MessagingFilterVo {
        let period: DatePeriod | undefined;

        if (dto?.startDate || dto?.endDate) {
            period = DatePeriod.create(dto.startDate, dto.endDate);
        }

        return new MessagingFilterVo({
            reportId: dto?.reportId?.trim() || undefined,
            search: dto?.search?.trim() || undefined,
            targetType: dto?.targetType,
            region: dto?.region,
            department: dto?.department,
            municipality: dto?.municipality,
            channels: dto?.channels,
            period,
        });
    }
}
