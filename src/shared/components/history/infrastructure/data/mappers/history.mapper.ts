import { inject, Injectable } from '@angular/core';
import { HistoryEntity } from '@shared/components/history/domain/entities/history.entity';
import { HistoryItemApiDto } from '@shared/components/history/infrastructure/api/dto/history-response.api.dto';
import { ActorMapper } from '@shared/data/mappers/actor.mapper';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class HistoryMapper extends PaginatedMapper<
    HistoryEntity,
    HistoryItemApiDto
> {
    private readonly utils = new MapperUtils();
    private readonly entityCache = new Map<string, HistoryEntity>();
    private readonly actorMapper = inject(ActorMapper);

    protected mapItemFromDto(dto: HistoryItemApiDto): HistoryEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const props = {
            id: dto.id,
            actionType: dto.type_action,
            action: dto.action,
            initiator: this.utils.memoized(dto.initiator, (i) =>
                this.actorMapper.mapToEntity(i)
            ),
            ip_address: dto.ip_address,
            createdAt: dto.created_at,
        };

        const cacheKey = `dto:${props.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(props) : new HistoryEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
