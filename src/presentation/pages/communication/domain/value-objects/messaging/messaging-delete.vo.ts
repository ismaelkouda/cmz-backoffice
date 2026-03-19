import { MessagingDeleteDto } from '@pages/communication/application/dto/messaging/messaging-delete.dto';

export class MessagingDeleteVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: MessagingDeleteDto): MessagingDeleteVo {
        return new MessagingDeleteVo({
            uniqId: dto.uniqId,
        });
    }
}
