import { inject, Injectable } from '@angular/core';
import { MessagingEntity } from '@pages/communication/domain/entities/messaging/messaging.entity';
import { MessagingProps } from '@pages/communication/domain/interfaces/messaging/messaging-props.interface';
import { MessagingItemApiDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-response-api.dto';
import { MessagingChannelsMapper } from '@pages/communication/infrastructure/data/mappers/messaging/messaging-channels.mapper';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({
    providedIn: 'root',
})
export class MessagingMapper extends PaginatedMapper<
    MessagingEntity,
    MessagingItemApiDto
> {
    private readonly entityCache = new Map<string, MessagingEntity>();
    private readonly channelsMapper = inject(MessagingChannelsMapper);
    private readonly utils = new MapperUtils();

    protected mapItemFromDto(dto: MessagingItemApiDto): MessagingEntity {
        MapperUtils.validateDto(dto, { required: ['uniq_id'] });
        const props: MessagingProps = {
            uniqId: dto.uniq_id,
            reportId: dto.report_id,
            type: dto.type,
            targetType: dto.target_type,
            region: dto.region,
            department: dto.department,
            municipality: dto.municipality,
            channels: this.utils.memoizedList(
                dto?.channels,
                (p) => this.channelsMapper.mapFromDto(p),
                (p) => `channel${p}`
            ),
            subject: dto.subject,
            content: dto.content,
            createdAt: dto.created_at,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.uniq_id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(props) : new MessagingEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
