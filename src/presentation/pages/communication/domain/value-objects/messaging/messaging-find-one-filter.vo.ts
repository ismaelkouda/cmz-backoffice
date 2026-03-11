import { MessagingFindOneFilterDto } from '@pages/communication/application/dto/messaging/messaging-find-one-filter.dto';

export class MessagingFindOneFilterVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: MessagingFindOneFilterDto): MessagingFindOneFilterVo {
        return new MessagingFindOneFilterVo({
            uniqId: dto.uniqId,
        });
    }
}
