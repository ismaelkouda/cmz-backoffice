import { inject, Injectable } from '@angular/core';

import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import { MessagingEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging.entity';
import { MessagingProps } from '@presentation/pages/communication/domain/interfaces/messaging/messaging-props.interface';
import { MessagingItemApiDto } from '@presentation/pages/communication/infrastructure/api/dto/messaging/messaging-response-api.dto';
import { ChannelsMapper } from '@presentation/pages/communication/infrastructure/data/mappers/messaging/messaging-channels.mapper';

@Injectable({
    providedIn: 'root',
})
export class MessagingMapper extends PaginatedMapper<
    MessagingEntity,
    MessagingItemApiDto
> {
    private readonly entityCache = new Map<string, MessagingEntity>();
    private readonly channelsMapper = inject(ChannelsMapper);
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
        };

        const cacheKey = `dto:${dto.uniq_id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(props) : new MessagingEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
