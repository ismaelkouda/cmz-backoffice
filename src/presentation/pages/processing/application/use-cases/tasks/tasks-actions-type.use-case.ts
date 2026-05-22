import { inject, Injectable } from '@angular/core';
import { TasksActionsTypeEntity } from '@pages/processing/domain/entities/tasks/tasks-actions-type.entity';
import { TasksActionsTypeRepository } from '@pages/processing/domain/repositories/tasks/tasks-actions-type-repository';
import { TasksActionsTypeFilterDto } from '@presentation/pages/processing/application/dto/tasks/tasks-actions-type-filter.dto';
import { TasksActionsTypeFilterEntity } from '@presentation/pages/processing/domain/entities/tasks/tasks-actions-type-filter.entity';
import { TasksActionsTypeFilterVo } from '@presentation/pages/processing/domain/value-objects/tasks/tasks-actions-type-filter.vo';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TasksActionsTypeUseCase {
    private readonly repository = inject(TasksActionsTypeRepository);

    readAll(
        filterDto: TasksActionsTypeFilterDto | null
    ): Observable<TasksActionsTypeEntity[]> {
        const vo = TasksActionsTypeFilterVo.fromDto(filterDto);
        const filter = TasksActionsTypeFilterEntity.fromVo(vo);
        return this.repository.readAll(filter);
    }
}
