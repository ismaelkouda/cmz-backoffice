import { inject, Injectable } from '@angular/core';
import { TasksActionsDeleteDto } from '@pages/processing/application/dto/tasks/tasks-actions-delete.dto';
import { TasksActionsFilterDto } from '@pages/processing/application/dto/tasks/tasks-actions-filter.dto';
import { TasksActionsCreateContract } from '@pages/processing/domain/contracts/tasks/tasks-actions-create.contract';
import { TasksActionsUpdateContract } from '@pages/processing/domain/contracts/tasks/tasks-actions-update.contract';
import { TasksActionsEntity } from '@pages/processing/domain/entities/tasks/tasks-actions.entity';
import { TasksActionsRepository } from '@pages/processing/domain/repositories/tasks/tasks-actions.repository';
import { tasksActionsCreateVo } from '@pages/processing/domain/value-objects/tasks/tasks-actions-create.vo';
import { tasksActionsDeleteVo } from '@pages/processing/domain/value-objects/tasks/tasks-actions-delete.vo';
import { tasksActionsFilterVo } from '@pages/processing/domain/value-objects/tasks/tasks-actions-filter.vo';
import { tasksActionsUpdateVo } from '@pages/processing/domain/value-objects/tasks/tasks-actions-update.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { defer, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TasksActionsUseCase {
    private readonly repository = inject(TasksActionsRepository);

    execute(
        dto: TasksActionsFilterDto,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<TasksActionsEntity>> {
        return this.repository.execute(
            tasksActionsFilterVo(dto),
            page,
            options
        );
    }

    create(
        dto: TasksActionsCreateContract
    ): Observable<SimpleResponseDto<void>> {
        return defer(() => this.repository.create(tasksActionsCreateVo(dto)));
    }

    update(
        dto: TasksActionsUpdateContract
    ): Observable<SimpleResponseDto<void>> {
        return defer(() => this.repository.update(tasksActionsUpdateVo(dto)));
    }

    delete(dto: TasksActionsDeleteDto): Observable<SimpleResponseDto<void>> {
        return this.repository.delete(tasksActionsDeleteVo(dto));
    }
}
