import { ChatbotFilterDto } from '@shared/components/management/application/dto/chatbot/chatbot-filter.dto';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class ChatbotFilterVo {
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
        dto: ChatbotFilterDto | null = {} as ChatbotFilterDto
    ): ChatbotFilterVo {
        let period: DatePeriod | undefined;

        if (dto?.startDate || dto?.endDate) {
            period = DatePeriod.create(dto.startDate, dto.endDate);
        }

        return new ChatbotFilterVo({
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
