import { Injectable } from '@angular/core';

import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import {
    MessagingFindOneEntity,
    MessagingFindOneProps,
} from '@presentation/pages/communication/domain/entities/messaging/messaging-find-one.entity';
import { MessagingFindOneItemApiDto } from '@presentation/pages/communication/infrastructure/api/dto/messaging/messaging-find-one-response-api.dto';

@Injectable({ providedIn: 'root' })
export class MessagingFindOneMapper extends SimpleResponseMapper<
    MessagingFindOneEntity,
    MessagingFindOneItemApiDto
> {
    private readonly entityCache = new Map<string, MessagingFindOneEntity>();

    protected mapItemFromDto(
        dto: MessagingFindOneItemApiDto
    ): MessagingFindOneEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const props: MessagingFindOneProps = {
            uniqId: dto.id,
            reportId: dto.report_id,
            type: dto.type,
            targetType: dto.target_type,
            region: dto.region,
            department: dto.department,
            municipality: dto.municipality,
            channels: dto.channels,
            subject: dto.subject,
            content: dto.content,
            createdAt: dto.created_at,
        };

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new MessagingFindOneEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
