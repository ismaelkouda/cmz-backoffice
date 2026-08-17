import { TasksActionsDeleteDto } from '@pages/processing/application/dto/tasks/tasks-actions-delete.dto';
import { TasksActionsFilterDto } from '@pages/processing/application/dto/tasks/tasks-actions-filter.dto';
import { TasksActionsCreateValidateContract } from '@pages/processing/domain/contracts/tasks/tasks-actions-create.validate-contract';
import { TasksActionsUpdateValidateContract } from '@pages/processing/domain/contracts/tasks/tasks-actions-update.validate-contract';
import { TasksActionsEntity } from '@pages/processing/domain/entities/tasks/tasks-actions.entity';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class TasksActionsRepository {
    abstract execute(
        filter: TasksActionsFilterDto | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<TasksActionsEntity>>;
    abstract create(
        props: TasksActionsCreateValidateContract
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        props: TasksActionsUpdateValidateContract
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(
        dto: TasksActionsDeleteDto
    ): Observable<SimpleResponseDto<void>>;
}
