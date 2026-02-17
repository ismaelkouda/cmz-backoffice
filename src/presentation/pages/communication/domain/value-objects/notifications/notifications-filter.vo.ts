import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

import { NotificationsFilterDto } from '@presentation/pages/communication/application/dto/notifications/notifications-filter.dto';

export class NotificationsFilterVo {
    public readonly search?: string;
    public readonly type?: string;
    public readonly period?: DatePeriod;

    private constructor(props: {
        search?: string;
        type?: string;
        period?: DatePeriod;
    }) {
        this.search = props.search;
        this.type = props.type;
        this.period = props.period;
    }

    static fromDto(dto: NotificationsFilterDto | null): NotificationsFilterVo {
        const search = dto?.search?.trim() || undefined;
        const type = dto?.type?.trim() || undefined;

        let period: DatePeriod | undefined;

        if (dto?.startDate || dto?.endDate) {
            period = DatePeriod.create(dto.startDate, dto.endDate);
        }

        return new NotificationsFilterVo({
            search,
            type,
            period,
        });
    }
}
