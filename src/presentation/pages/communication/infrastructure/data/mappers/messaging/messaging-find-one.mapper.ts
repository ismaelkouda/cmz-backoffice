import { Injectable } from '@angular/core';
import {
    MessagingFindOneEntity,
    MessagingFindOneProps,
} from '@pages/communication/domain/entities/messaging/messaging-find-one.entity';
import { MessagingFindOneItemApiDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-find-one-response-api.dto';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class MessagingFindOneMapper extends SimpleResponseMapper<
    MessagingFindOneEntity,
    MessagingFindOneItemApiDto
> {
    private readonly entityCache = new Map<string, MessagingFindOneEntity>();

    protected mapItemFromDto(
        dto: MessagingFindOneItemApiDto
    ): MessagingFindOneEntity {
        MapperUtils.validateDto(dto, { required: ['uniq_id'] });

        const props: MessagingFindOneProps = {
            uniqId: dto.uniq_id,
            reportId: dto.report_uniq_id,
            type: dto.type.toLowerCase(),
            targetType: dto.target_type,
            region: dto.region?.id,
            department: dto.department?.id,
            municipality: dto.municipality?.id,
            channels: dto.channels,
            subject: dto.subject,
            content: dto.content,
            createdAt: dto.created_at,
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
