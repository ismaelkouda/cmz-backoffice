import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { TasksActionsCreateEntity } from '@presentation/pages/processing/domain/entities/tasks/tasks-actions-create.entity';
import { TasksActionsDeleteEntity } from '@presentation/pages/processing/domain/entities/tasks/tasks-actions-delete.entity';
import { TasksActionsFilterEntity } from '@presentation/pages/processing/domain/entities/tasks/tasks-actions-filter.entity';
import { TasksActionsUpdateEntity } from '@presentation/pages/processing/domain/entities/tasks/tasks-actions-update.entity';
import { TasksActionsEntity } from '@presentation/pages/processing/domain/entities/tasks/tasks-actions.entity';
import { TasksActionsRepository } from '@presentation/pages/processing/domain/repositories/tasks/tasks-actions.repository';
import { tasksActionsCreateMapper } from '@presentation/pages/processing/infrastructure/data/mappers/tasks/tasks-actions-create.mapper';
import { tasksActionsDeleteMapper } from '@presentation/pages/processing/infrastructure/data/mappers/tasks/tasks-actions-delete.mapper';
import { TasksActionsFilterMapper } from '@presentation/pages/processing/infrastructure/data/mappers/tasks/tasks-actions-filter.mapper';
import { tasksActionsUpdateMapper } from '@presentation/pages/processing/infrastructure/data/mappers/tasks/tasks-actions-update.mapper';
import { TasksActionsMapper } from '@presentation/pages/processing/infrastructure/data/mappers/tasks/tasks-actions.mapper';
import { TasksActionsApi } from '@presentation/pages/processing/infrastructure/data/sources/tasks/tasks-actions.api';

@Injectable({ providedIn: 'root' })
export class TasksActionsRepositoryImpl extends TasksActionsRepository {
    private readonly api = inject(TasksActionsApi);
    private readonly mapper = inject(TasksActionsMapper);

    execute(
        entity: TasksActionsFilterEntity,
        page: string
    ): Observable<Paginate<TasksActionsEntity>> {
        return this.api
            .execute(TasksActionsFilterMapper(entity), page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(
        entity: TasksActionsCreateEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.create(tasksActionsCreateMapper(entity));
    }

    update(
        entity: TasksActionsUpdateEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.update(tasksActionsUpdateMapper(entity));
    }

    delete(
        entity: TasksActionsDeleteEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.delete(tasksActionsDeleteMapper(entity));
    }
}
