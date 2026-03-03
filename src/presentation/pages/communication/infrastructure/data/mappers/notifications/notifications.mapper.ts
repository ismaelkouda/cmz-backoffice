import { inject, Injectable } from '@angular/core';

import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import {
    NotificationsEntity,
    NotificationsProps,
} from '@presentation/pages/communication/domain/entities/notifications/notifications.entity';
import { NotificationsItemApiDto } from '@presentation/pages/communication/infrastructure/api/dto/notifications/notifications-response-api.dto';
import { StatusMapper } from '@presentation/pages/communication/infrastructure/data/mappers/notifications/notifications-status.mapper';

@Injectable({
    providedIn: 'root',
})
export class NotificationsMapper extends PaginatedMapper<
    NotificationsEntity,
    NotificationsItemApiDto
> {
    private readonly statusMapper = inject(StatusMapper);
    private readonly entityCache = new Map<string, NotificationsEntity>();

    protected mapItemFromDto(
        dto: NotificationsItemApiDto
    ): NotificationsEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const props: NotificationsProps = {
            uniqId: dto.id,
            reference: dto.model_id,
            title: dto.title,
            type: dto.type,
            message: dto.message,
            status: this.statusMapper.mapApiToStatus(dto.status),
            sendAt: dto.sent_at,
        };

        const cacheKey = `dto:${props.uniqId}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new NotificationsEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
