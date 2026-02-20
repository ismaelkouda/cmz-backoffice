import { Injectable } from '@angular/core';

import { HistoryEntity } from '@shared/components/history/domain/entities/history.entity';
import { HistoryItemApiDto } from '@shared/components/history/infrastructure/api/dto/history-response.api.dto';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class HistoryMapper extends PaginatedMapper<
    HistoryEntity,
    HistoryItemApiDto
> {
    private readonly entityCache = new Map<string, HistoryEntity>();

    protected mapItemFromDto(dto: HistoryItemApiDto): HistoryEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(dto) : HistoryEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
