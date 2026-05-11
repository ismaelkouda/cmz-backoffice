import { inject, Injectable } from '@angular/core';
import { TasksActionsTypeEntity } from '@pages/processing/domain/entities/tasks/tasks-actions-type.entity';
import { TasksActionsTypeRepository } from '@pages/processing/domain/repositories/tasks/tasks-actions-type-repository';
import { TasksActionsTypeMapper } from '@pages/processing/infrastructure/data/mappers/tasks/tasks-actions-type.mapper';
import { TasksActionsTypeApi } from '@pages/processing/infrastructure/data/sources/tasks/tasks-actions-type.api';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TasksActionsTypeRepositoryImpl implements TasksActionsTypeRepository {
    private readonly api = inject(TasksActionsTypeApi);
    private readonly mapper = inject(TasksActionsTypeMapper);

    readAll(): Observable<TasksActionsTypeEntity[]> {
        return this.api
            .readAll()
            .pipe(map((dto) => this.mapper.mapFromDto(dto)));
    }
}
