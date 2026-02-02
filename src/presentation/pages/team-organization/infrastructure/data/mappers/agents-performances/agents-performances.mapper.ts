import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/utils/utils/mappers/mapper-utils';

import { AgentsPerformancesEntity } from '@presentation/pages/team-organization/domain/entities/agents-performances/agents-performances.entity';
import { AgentsPerformancesItemApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/agents-performances/agents-performances-response-api.dto';

export class AgentsPerformancesMapper extends PaginatedMapper<
    AgentsPerformancesEntity,
    AgentsPerformancesItemApiDto
> {
    private readonly entityCache = new Map<string, AgentsPerformancesEntity>();

    protected mapItemFromDto(
        dto: AgentsPerformancesItemApiDto
    ): AgentsPerformancesEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : AgentsPerformancesEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
