import { Injectable } from '@angular/core';
import {
    NotificationsFindOneEntity,
    NotificationsFindOneProps,
} from '@pages/communication/domain/entities/notifications/notifications-find-one.entity';
import { NotificationsFindOneItemApiDto } from '@pages/communication/infrastructure/api/dto/notifications/notifications-find-one-response-api.dto';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class NotificationsFindOneMapper extends PaginatedMapper<
    NotificationsFindOneEntity,
    NotificationsFindOneItemApiDto
> {
    private readonly entityCache = new Map<
        string,
        NotificationsFindOneEntity
    >();

    protected mapItemFromDto(
        dto: NotificationsFindOneItemApiDto
    ): NotificationsFindOneEntity {
        MapperUtils.validateDto(dto, { required: ['uniq_id'] });

        const props: NotificationsFindOneProps = {
            uniqId: dto.uniq_id,
            reportType: dto.report_type,
            operators: dto.operators,
            source: dto.source,
            initiatorPhoneNumber: dto.initiator_phone_number,
            createdAt: dto.created_at,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.uniq_id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new NotificationsFindOneEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
