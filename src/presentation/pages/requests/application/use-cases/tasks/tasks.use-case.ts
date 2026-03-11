import { inject, Injectable } from '@angular/core';
import { TasksFilterDto } from '@pages/requests/application/dto/tasks/tasks-filter.dto';
import { TasksFilterEntity } from '@pages/requests/domain/entities/tasks/tasks-filter.entity';
import { TasksEntity } from '@pages/requests/domain/entities/tasks/tasks.entity';
import { TasksRepository } from '@pages/requests/domain/repositories/tasks/tasks.repository';
import { TasksFilterVo } from '@pages/requests/domain/value-objects/tasks/tasks-filter.vo';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
