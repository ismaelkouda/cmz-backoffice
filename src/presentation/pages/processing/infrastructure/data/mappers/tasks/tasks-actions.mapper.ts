import { Injectable } from '@angular/core';
import {
    TasksActionsEntity,
    TasksActionsProps,
    TasksActionsType,
} from '@pages/processing/domain/entities/tasks/tasks-actions.entity';
import { TasksActionsItemApiDto } from '@pages/processing/infrastructure/api/dto/tasks/tasks-actions-response-api.dto';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class TasksActionsMapper extends PaginatedMapper<
    TasksActionsEntity,
    TasksActionsItemApiDto
> {
    private readonly entityCache = new Map<string, TasksActionsEntity>();

    protected override mapItemFromDto(
        dto: TasksActionsItemApiDto
    ): TasksActionsEntity {
        MapperUtils.validateDto(dto, { required: ['uniq_id'] });
        const props: TasksActionsProps = {
            uniqId: dto.uniq_id,
            date: dto.date,
            type: this.mapActionType(dto.type),
            description: dto.description,
            shouldNotifyUser: dto.should_notify_user ?? false,
            createdBy: dto.created_by,
            updatedBy: dto.updated_by,
            createdAt: dto.created_at,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.uniq_id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new TasksActionsEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }

    private mapActionType(type: string): TasksActionsType {
        const validTypes: TasksActionsType[] = [
            'ANALYSIS',
            'TREATMENT',
            'VERIFICATION',
            'CORRECTION',
            'VALIDATION',
            'OTHER',
        ];
        return validTypes.includes(type as TasksActionsType)
            ? (type as TasksActionsType)
            : 'OTHER';
    }
}
