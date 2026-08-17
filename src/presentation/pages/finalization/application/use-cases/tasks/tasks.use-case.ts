import { inject, Injectable } from '@angular/core';
import { TasksFilterDto } from '@pages/finalization/application/dto/tasks/tasks-filter.dto';
import { TasksFilterEntity } from '@pages/finalization/domain/entities/tasks/tasks-filter.entity';
import { TasksEntity } from '@pages/finalization/domain/entities/tasks/tasks.entity';
import { TasksRepository } from '@pages/finalization/domain/repositories/tasks/tasks.repository';
import { TasksFilterVo } from '@pages/finalization/domain/value-objects/tasks/tasks-filter.vo';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TasksUseCase {
    private readonly repository = inject(TasksRepository);

    execute(
        filterDto: TasksFilterDto | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<TasksEntity>> {
        const vo = TasksFilterVo.fromDto(filterDto);
        const entity = TasksFilterEntity.fromVo(vo);
        return this.repository.execute(entity, page, options);
    }
}
