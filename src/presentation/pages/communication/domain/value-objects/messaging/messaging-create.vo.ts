import { MessagingCreateDto } from '@presentation/pages/communication/application/dto/messaging/messaging-create.dto';

export class MessagingCreateVo {
    public readonly reportId: string;
    public readonly type: string;
    public readonly targetType: string;
    public readonly region: string;
    public readonly department: string;
    public readonly municipality: string;
    public readonly channels: string[];
    public readonly subject: string;
    public readonly content: string;
    public readonly message: string;

    constructor(props: {
        reportId: string;
        type: string;
        targetType: string;
        region: string;
        department: string;
        municipality: string;
        channels: string[];
        subject: string;
        content: string;
        message: string;
    }) {
        this.reportId = props.reportId;
        this.type = props.type;
        this.targetType = props.targetType;
        this.region = props.region;
        this.department = props.department;
        this.municipality = props.municipality;
        this.channels = props.channels;
        this.subject = props.subject;
        this.content = props.content;
        this.message = props.message;
    }

    static fromDto(dto: MessagingCreateDto): MessagingCreateVo {
        return new MessagingCreateVo({
            reportId: dto.reportId,
            type: dto.type,
            targetType: dto.targetType,
            region: dto.region,
            department: dto.department,
            municipality: dto.municipality,
            channels: dto.channels,
            subject: dto.subject,
            content: dto.content,
            message: dto.message,
        });
    }
}
