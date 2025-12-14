import { Injectable } from '@angular/core';
import { NotificationsItemDto } from '@presentation/pages/communication/data/dtos/notifications-response.dto';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { NotificationsEntity } from '../../domain/entities/notifications.entity';

@Injectable({ providedIn: 'root' })
export class NotificationsMapper extends PaginatedMapper<NotificationsEntity, NotificationsItemDto> {
    protected override mapItemFromDto(dto: NotificationsItemDto): NotificationsEntity {
        return new NotificationsEntity(
            dto.uniq_id,
            dto.type,
            dto.message,
            dto.created_at
        );
    }
}
