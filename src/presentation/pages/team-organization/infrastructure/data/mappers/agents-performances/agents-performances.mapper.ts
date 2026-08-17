import { inject, Injectable } from '@angular/core';
import {
    AgentsPerformancesEntity,
    AgentsPerformancesProps,
} from '@pages/team-organization/domain/entities/agents-performances/agents-performances.entity';
import { AgentsPerformancesItemApiDto } from '@pages/team-organization/infrastructure/api/dto/agents-performances/agents-performances-response-api.dto';
import { StatusMapper } from '@pages/team-organization/infrastructure/data/mappers/agents-performances/agents-performances-status.mapper';
import { ActorMapper } from '@shared/data/mappers/actor.mapper';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { ActorEntity } from '@shared/domain/entities/actor.entity';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class AgentsPerformancesMapper extends PaginatedMapper<
    AgentsPerformancesEntity,
    AgentsPerformancesItemApiDto
> {
    private readonly utils = new MapperUtils();
    private readonly actorMapper = inject(ActorMapper);
    private readonly statusMapper = inject(StatusMapper);
    private readonly entityCache = new Map<string, AgentsPerformancesEntity>();

    protected mapItemFromDto(
        dto: AgentsPerformancesItemApiDto
    ): AgentsPerformancesEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const user = this.utils.memoized(dto.user, (i) =>
            this.actorMapper.mapToEntity(i)
        ) as ActorEntity;

        const props: AgentsPerformancesProps = {
            uniqId: dto.id,
            user,
            goalsSize: dto.task_target,
            achievementsSize: dto.tasks_completed,
            percentages: dto.percentage,
            status: this.statusMapper.mapFromDto(dto.status),
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
}
