import { MessagingDisableDto } from '@pages/communication/application/dto/messaging/messaging-disable.dto';

export class MessagingDisableVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: MessagingDisableDto): MessagingDisableVo {
        return new MessagingDisableVo({
            uniqId: dto.uniqId,
        });
    }
}
