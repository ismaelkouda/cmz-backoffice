import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import {
    AgentsPerformancesEntity,
    AgentsPerformancesProps,
} from '@presentation/pages/team-organization/domain/entities/agents-performances/agents-performances.entity';
import { AGENTS_PERFORMANCES_STATUS } from '@presentation/pages/team-organization/domain/enums/agents-performances/agents-performances-status.enum';
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

        const props: AgentsPerformancesProps = {
            uniqId: dto.id,
            name: dto.name,
            goalsSize: dto.goals_size,
            achievementsSize: dto.achievements_size,
            percentages: dto.percentages,
            status: this.mapActionDropdown(dto.is_active),
            createdAt: dto.created_at,
        };

        const cacheKey = `dto:${props.uniqId}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new AgentsPerformancesEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }

    private mapActionDropdown(status: boolean): AGENTS_PERFORMANCES_STATUS {
        if (status) {
            return AGENTS_PERFORMANCES_STATUS.ACHIEVED;
        }
        return AGENTS_PERFORMANCES_STATUS.NOT_ACHIEVED;
    }
}
