import { NotificationsReadOneDto } from '@pages/communication/application/dto/notifications/notifications-read-one.dto';

export class NotificationsReadOneVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: NotificationsReadOneDto): NotificationsReadOneVo {
        return new NotificationsReadOneVo({
            uniqId: dto.uniqId,
        });
    }
}
