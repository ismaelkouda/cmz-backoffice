import { NotificationsFindOneFilterDto } from '@presentation/pages/communication/application/dto/notifications/notifications-find-one-filter.dto';

export class NotificationsFindOneFilterVo {
    public readonly uniqId?: string;

    private constructor(props: { uniqId?: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(
        dto: NotificationsFindOneFilterDto | null
    ): NotificationsFindOneFilterVo {
        const uniqId = dto?.uniqId.trim();

        return new NotificationsFindOneFilterVo({
            uniqId,
        });
    }
}
