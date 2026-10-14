import { Injectable, inject } from '@angular/core';
import { NotificationsFilterEntity } from '@pages/communication/domain/entities/notifications/notifications-filter.entity';
import { NotificationsFilterApiDto } from '@pages/communication/infrastructure/api/dto/notifications/notifications-filter-api.dto';
import { ApiDateMapper } from '@shared/data/mappers/api-date.mapper';

@Injectable({ providedIn: 'root' })
export class NotificationsFilterMapper {
    private readonly apiDateMapper = inject(ApiDateMapper);

    map(entity: NotificationsFilterEntity): NotificationsFilterApiDto {
        return {
            ...(entity.search && { search: entity.search }),
            ...(entity.type && { type: entity.type }),
            ...(entity.period?.start && {
                start_date: this.apiDateMapper.toDateApi(entity.period.start),
            }),
            ...(entity.period?.end && {
                end_date: this.apiDateMapper.toDateApi(entity.period.end),
            }),
        };
    }
}
