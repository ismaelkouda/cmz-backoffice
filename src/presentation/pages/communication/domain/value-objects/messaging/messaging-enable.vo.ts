import { MessagingEnableDto } from '@pages/communication/application/dto/messaging/messaging-enable.dto';

export class MessagingEnableVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: MessagingEnableDto): MessagingEnableVo {
        return new MessagingEnableVo({
            uniqId: dto.uniqId,
        });
    }
}
