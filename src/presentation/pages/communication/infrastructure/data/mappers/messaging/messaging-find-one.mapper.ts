import { inject, Injectable } from '@angular/core';
import { MessagingFindOneEntity } from '@pages/communication/domain/entities/messaging/messaging-find-one.entity';
import { MessagingFindOneItemApiDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-find-one-response-api.dto';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MessagingTypeMapper } from '@pages/communication/infrastructure/data/mappers/messaging/messaging-type.mapper';
import { MessagingTargetMapper } from '@pages/communication/infrastructure/data/mappers/messaging/messaging-target.mapper';
import { MessagingChannelsMapper } from '@pages/communication/infrastructure/data/mappers/messaging/messaging-channels.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';
import { MessagingFindOneProps } from '@presentation/pages/communication/domain/interfaces/messaging/messaging-find-one-props.interface';

@Injectable({ providedIn: 'root' })
export class MessagingFindOneMapper extends SimpleResponseMapper<
    MessagingFindOneEntity,
    MessagingFindOneItemApiDto
> {
    private readonly utils = new MapperUtils();
    private readonly entityCache = new Map<string, MessagingFindOneEntity>();
    private readonly typeMapper = inject(MessagingTypeMapper);
    private readonly targetMapper = inject(MessagingTargetMapper);
    private readonly channelsMapper = inject(MessagingChannelsMapper);

    protected mapItemFromDto(
        dto: MessagingFindOneItemApiDto
    ): MessagingFindOneEntity {
        MapperUtils.validateDto(dto, { required: ['uniq_id'] });

        const props: MessagingFindOneProps = {
            uniqId: dto.uniq_id,
            reportId: dto.report_uniq_id,
            type: this.typeMapper.mapFromDto(dto.type),
            targetType: this.targetMapper.mapFromDto(dto.target_type),
            region: JSON.stringify(dto.region?.id),
            department: JSON.stringify(dto.department?.id),
            municipality: JSON.stringify(dto.municipality?.id),
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

        const entity = cached
            ? cached.with(props)
            : new MessagingFindOneEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
