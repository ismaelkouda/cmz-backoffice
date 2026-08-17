import { inject, Injectable } from '@angular/core';
import { TasksActionsTypeEntity } from '@pages/processing/domain/entities/tasks/tasks-actions-type.entity';
import { TasksActionsTypeRepository } from '@pages/processing/domain/repositories/tasks/tasks-actions-type-repository';
import { tasksActionsTypeFilterMapper } from '@pages/processing/infrastructure/data/mappers/tasks/tasks-actions-type-filter.mapper';
import { TasksActionsTypeMapper } from '@pages/processing/infrastructure/data/mappers/tasks/tasks-actions-type.mapper';
import { TasksActionsTypeApi } from '@pages/processing/infrastructure/data/sources/tasks/tasks-actions-type.api';
import { TasksActionsTypeFilterEntity } from '@presentation/pages/processing/domain/entities/tasks/tasks-actions-type-filter.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TasksActionsTypeRepositoryImpl implements TasksActionsTypeRepository {
    private readonly api = inject(TasksActionsTypeApi);
    private readonly mapper = inject(TasksActionsTypeMapper);

    readAll(
        filter: TasksActionsTypeFilterEntity,
        options?: FetchOptions
    ): Observable<TasksActionsTypeEntity[]> {
        const paramsDto = tasksActionsTypeFilterMapper(filter);
        return this.api
            .readAll(paramsDto, options)
            .pipe(map((dto) => this.mapper.mapFromDto(dto)));
    }
}
