import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { TasksFilterEntity } from '@presentation/pages/processing/domain/entities/tasks/tasks-filter.entity';
import { TasksEntity } from '@presentation/pages/processing/domain/entities/tasks/tasks.entity';
import { TasksRepository } from '@presentation/pages/processing/domain/repositories/tasks/tasks.repository';
import { tasksFilterMapper } from '@presentation/pages/processing/infrastructure/data/mappers/tasks/tasks-filter.mapper';
import { TasksMapper } from '@presentation/pages/processing/infrastructure/data/mappers/tasks/tasks.mapper';
import { TasksApi } from '@presentation/pages/processing/infrastructure/data/sources/tasks/tasks.api';

@Injectable({
    providedIn: 'root',
})
export class TasksRepositoryImpl extends TasksRepository {
    private readonly api = inject(TasksApi);
    private readonly mapper = inject(TasksMapper);

    execute(
        entity: TasksFilterEntity,
        page: string
    ): Observable<Paginate<TasksEntity>> {
        return this.api
            .execute(tasksFilterMapper(entity), page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
