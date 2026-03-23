import { inject, Injectable } from '@angular/core';
import { NotificationsEntity } from '@pages/communication/domain/entities/notifications/notifications.entity';
import { NotificationsProps } from '@pages/communication/domain/interfaces/notifications/notifications-props.interface';
import { NotificationsItemApiDto } from '@pages/communication/infrastructure/api/dto/notifications/notifications-response-api.dto';
import { StatusMapper } from '@pages/communication/infrastructure/data/mappers/notifications/notifications-status.mapper';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

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
            status: this.statusMapper.mapFromDto(dto.status),
            sendAt: dto.sent_at,
            updatedAt: dto.updated_at,
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
