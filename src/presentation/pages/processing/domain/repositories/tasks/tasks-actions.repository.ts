import { TasksActionsCreateEntity } from '@pages/processing/domain/entities/tasks/tasks-actions-create.entity';
import { TasksActionsDeleteEntity } from '@pages/processing/domain/entities/tasks/tasks-actions-delete.entity';
import { TasksActionsFilterEntity } from '@pages/processing/domain/entities/tasks/tasks-actions-filter.entity';
import { TasksActionsUpdateEntity } from '@pages/processing/domain/entities/tasks/tasks-actions-update.entity';
import { TasksActionsEntity } from '@pages/processing/domain/entities/tasks/tasks-actions.entity';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class TasksActionsRepository {
    abstract execute(
        entity: TasksActionsFilterEntity | null,
        page: string,
        options?: FetchOptions
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
