import { inject, Injectable } from '@angular/core';
import { TasksActionsTypeEntity } from '@pages/processing/domain/entities/tasks/tasks-actions-type.entity';
import { TasksActionsTypeProps } from '@presentation/pages/processing/domain/interfaces/tasks/tasks-actions/tasks-actions-type-props.interface';
import { TasksActionsTypeItemApiDto } from '@presentation/pages/processing/infrastructure/api/dto/tasks/tasks-actions-type-response-api.dto';
import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';
import { TelecomOperatorMapper } from '@shared/data/mappers/telecom-operator.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class TasksActionsTypeMapper extends ArrayResponseMapper<
    TasksActionsTypeEntity,
    TasksActionsTypeItemApiDto
> {
    private readonly utils = new MapperUtils();
    private readonly entityCache = new Map<string, TasksActionsTypeEntity>();
    private readonly telecomOperatorMapper = inject(TelecomOperatorMapper);

    protected override mapItemFromDto(
        dto: TasksActionsTypeItemApiDto
    ): TasksActionsTypeEntity {
        MapperUtils.validateDto(dto, {
            required: ['code'],
        });

        const props: TasksActionsTypeProps = {
            label: dto.name,
            value: dto.code,
            operators: this.utils.memoizedList(
                dto?.operators,
                (p) => this.telecomOperatorMapper.mapFromDto(p),
                (p) => `operator${p}`
            ),
        };

        const cacheKey = `dto:${dto.code}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new TasksActionsTypeEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
