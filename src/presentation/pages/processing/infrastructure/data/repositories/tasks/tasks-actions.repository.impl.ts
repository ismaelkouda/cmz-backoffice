import { inject, Injectable } from '@angular/core';
import { TasksActionsCreateEntity } from '@pages/processing/domain/entities/tasks/tasks-actions-create.entity';
import { TasksActionsDeleteEntity } from '@pages/processing/domain/entities/tasks/tasks-actions-delete.entity';
import { TasksActionsFilterEntity } from '@pages/processing/domain/entities/tasks/tasks-actions-filter.entity';
import { TasksActionsUpdateEntity } from '@pages/processing/domain/entities/tasks/tasks-actions-update.entity';
import { TasksActionsEntity } from '@pages/processing/domain/entities/tasks/tasks-actions.entity';
import { TasksActionsRepository } from '@pages/processing/domain/repositories/tasks/tasks-actions.repository';
import { tasksActionsCreateMapper } from '@pages/processing/infrastructure/data/mappers/tasks/tasks-actions-create.mapper';
import { tasksActionsDeleteMapper } from '@pages/processing/infrastructure/data/mappers/tasks/tasks-actions-delete.mapper';
import { TasksActionsFilterMapper } from '@pages/processing/infrastructure/data/mappers/tasks/tasks-actions-filter.mapper';
import { tasksActionsUpdateMapper } from '@pages/processing/infrastructure/data/mappers/tasks/tasks-actions-update.mapper';
import { TasksActionsMapper } from '@pages/processing/infrastructure/data/mappers/tasks/tasks-actions.mapper';
import { TasksActionsApi } from '@pages/processing/infrastructure/data/sources/tasks/tasks-actions.api';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { Observable, map } from 'rxjs';

import { ConformityMapper } from '../../mappers/tasks/tasks-actions-conformity.mapper';

@Injectable({ providedIn: 'root' })
export class TasksActionsRepositoryImpl extends TasksActionsRepository {
    private readonly api = inject(TasksActionsApi);
    private readonly mapper = inject(TasksActionsMapper);
    private readonly conformityMapper = inject(ConformityMapper);

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
        return this.api.create(
            tasksActionsCreateMapper(entity, this.conformityMapper)
        );
    }

    update(
        entity: TasksActionsUpdateEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.update(
            tasksActionsUpdateMapper(entity, this.conformityMapper)
        );
    }

    delete(
        entity: TasksActionsDeleteEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.delete(tasksActionsDeleteMapper(entity));
    }
}
