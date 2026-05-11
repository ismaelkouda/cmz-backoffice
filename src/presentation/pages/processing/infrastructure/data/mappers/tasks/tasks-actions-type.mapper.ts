import { Injectable } from '@angular/core';
import { TasksActionsTypeEntity } from '@pages/processing/domain/entities/tasks/tasks-actions-type.entity';
import { TasksActionsTypeItemApiDto } from '@pages/processing/infrastructure/api/dto/tasks/tasks-actions-type-api.dto';
import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class TasksActionsTypeMapper extends ArrayResponseMapper<
    TasksActionsTypeEntity,
    TasksActionsTypeItemApiDto
> {
    private readonly entityCache = new Map<string, TasksActionsTypeEntity>();

    protected mapItemFromDto(
        dto: TasksActionsTypeItemApiDto
    ): TasksActionsTypeEntity {
        MapperUtils.validateDto(dto, { required: ['code'] });
        const cacheKey = `dto:${dto.code}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : TasksActionsTypeEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
