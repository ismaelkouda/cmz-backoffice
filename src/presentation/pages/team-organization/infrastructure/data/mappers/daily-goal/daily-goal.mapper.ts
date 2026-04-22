import { inject, Injectable } from '@angular/core';
import {
    DailyGoalEntity,
    DailyGoalProps,
} from '@pages/team-organization/domain/entities/daily-goal/daily-goal.entity';
import { DailyGoalItemApiDto } from '@pages/team-organization/infrastructure/api/dto/daily-goal/daily-goal-response-api.dto';
import { StatusMapper } from '@pages/team-organization/infrastructure/data/mappers/daily-goal/daily-goal-status.mapper';
import { ActorMapper } from '@shared/data/mappers/actor.mapper';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { ActorEntity } from '@shared/domain/entities/actor.entity';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class DailyGoalMapper extends PaginatedMapper<
    DailyGoalEntity,
    DailyGoalItemApiDto
> {
    private readonly utils = new MapperUtils();
    private readonly actorMapper = inject(ActorMapper);
    private readonly statusMapper = inject(StatusMapper);
    private readonly entityCache = new Map<string, DailyGoalEntity>();

    protected mapItemFromDto(dto: DailyGoalItemApiDto): DailyGoalEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const user = this.utils.memoized(dto.user, (i) =>
            this.actorMapper.mapToEntity(i)
        ) as ActorEntity;

        const props: DailyGoalProps = {
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

        const entity = cached ? cached.with(props) : new DailyGoalEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
