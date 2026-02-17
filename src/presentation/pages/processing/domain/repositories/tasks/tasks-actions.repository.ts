import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { TasksActionsCreateEntity } from '@presentation/pages/processing/domain/entities/tasks/tasks-actions-create.entity';
import { TasksActionsDeleteEntity } from '@presentation/pages/processing/domain/entities/tasks/tasks-actions-delete.entity';
import { TasksActionsFilterEntity } from '@presentation/pages/processing/domain/entities/tasks/tasks-actions-filter.entity';
import { TasksActionsUpdateEntity } from '@presentation/pages/processing/domain/entities/tasks/tasks-actions-update.entity';
import { TasksActionsEntity } from '@presentation/pages/processing/domain/entities/tasks/tasks-actions.entity';

export abstract class TasksActionsRepository {
    abstract execute(
        entity: TasksActionsFilterEntity | null,
        page: string
    ): Observable<Paginate<TasksActionsEntity>>;
    abstract create(
        entity: TasksActionsCreateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        entity: TasksActionsUpdateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(
        entity: TasksActionsDeleteEntity
    ): Observable<SimpleResponseDto<void>>;
}
