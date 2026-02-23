import { Injectable } from '@angular/core';

import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import { AccessLogsEntity } from '@presentation/pages/settings-security/domain/entities/access-logs/access-logs.entity';
import { AccessLogsItemApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/access-logs/access-logs-response-api.dto';

@Injectable({
    providedIn: 'root',
})
export class AccessLogsMapper extends PaginatedMapper<
    AccessLogsEntity,
    AccessLogsItemApiDto
> {
    private readonly entityCache = new Map<string, AccessLogsEntity>();

    protected mapItemFromDto(dto: AccessLogsItemApiDto): AccessLogsEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : AccessLogsEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
