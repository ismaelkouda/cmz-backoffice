import { inject, Injectable } from '@angular/core';
import { TasksActionsEntity } from '@pages/processing/domain/entities/tasks/tasks-actions.entity';
import { TasksActionsItemApiDto } from '@pages/processing/infrastructure/api/dto/tasks/tasks-actions-response-api.dto';
import { TasksActionsProps } from '@presentation/pages/processing/domain/interfaces/tasks/tasks-actions/tasks-actions-props.interface';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { TelecomOperatorMapper } from '@shared/data/mappers/telecom-operator.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class TasksActionsMapper extends PaginatedMapper<
    TasksActionsEntity,
    TasksActionsItemApiDto
> {
    private readonly utils = new MapperUtils();
    private readonly telecomOperatorMapper = inject(TelecomOperatorMapper);
    private readonly entityCache = new Map<string, TasksActionsEntity>();

    protected override mapItemFromDto(
        dto: TasksActionsItemApiDto
    ): TasksActionsEntity {
        const operators = [dto.operator];
        MapperUtils.validateDto(dto, { required: ['id'] });
        const props: TasksActionsProps = {
            uniqId: dto.id,
            date: dto.date ? new Date(dto.date) : new Date(),
            type: dto.type,
            code: dto.type_code,
            operators: this.utils.memoizedList(
                operators,
                (p) => this.telecomOperatorMapper.mapFromDto(p),
                (p) => `operator${p}`
            ),
            description: dto.description,
            shouldNotifyUser: dto.should_notify_user ?? false,
            isConform: dto.status ?? false,
            createdBy: `${dto.created_by.last_name} ${dto.created_by.first_name}`,
            updatedBy: `${dto.updated_by.last_name} ${dto.updated_by.first_name}`,
            createdAt: dto.created_at,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new TasksActionsEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
