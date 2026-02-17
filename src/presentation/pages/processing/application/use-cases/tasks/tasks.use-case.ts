import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { TasksFilterDto } from '@presentation/pages/processing/application/dto/tasks/tasks-filter.dto';
import { TasksFilterEntity } from '@presentation/pages/processing/domain/entities/tasks/tasks-filter.entity';
import { TasksEntity } from '@presentation/pages/processing/domain/entities/tasks/tasks.entity';
import { TasksRepository } from '@presentation/pages/processing/domain/repositories/tasks/tasks.repository';
import { TasksFilterVo } from '@presentation/pages/processing/domain/value-objects/tasks/tasks-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class TasksUseCase {
    private readonly repository = inject(TasksRepository);

    execute(
        filterDto: TasksFilterDto | null,
        page: string
    ): Observable<Paginate<TasksEntity>> {
        const vo = TasksFilterVo.fromDto(filterDto);
        const entity = TasksFilterEntity.fromVo(vo);
        return this.repository.execute(entity, page);
    }
}
