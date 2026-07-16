import { inject, Injectable } from '@angular/core';
import { TasksActionsDeleteDto } from '@pages/processing/application/dto/tasks/tasks-actions-delete.dto';
import { TasksActionsFilterDto } from '@pages/processing/application/dto/tasks/tasks-actions-filter.dto';
import { TasksActionsCreateValidateContract } from '@pages/processing/domain/contracts/tasks/tasks-actions-create.validate-contract';
import { TasksActionsUpdateValidateContract } from '@pages/processing/domain/contracts/tasks/tasks-actions-update.validate-contract';
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
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class TasksActionsRepositoryImpl extends TasksActionsRepository {
    private readonly api = inject(TasksActionsApi);
    private readonly mapper = inject(TasksActionsMapper);
    private readonly conformityMapper = inject(ConformityMapper);

    execute(
        filter: TasksActionsFilterDto,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<TasksActionsEntity>> {
        return this.api
            .execute(TasksActionsFilterMapper(filter), page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(
        props: TasksActionsCreateValidateContract
    ): Observable<SimpleResponseDto<void>> {
        return this.api.create(
            tasksActionsCreateMapper(props, this.conformityMapper)
        );
    }

    update(
        props: TasksActionsUpdateValidateContract
    ): Observable<SimpleResponseDto<void>> {
        return this.api.update(
            tasksActionsUpdateMapper(props, this.conformityMapper)
        );
    }

    delete(dto: TasksActionsDeleteDto): Observable<SimpleResponseDto<void>> {
        return this.api.delete(tasksActionsDeleteMapper(dto));
    }
}
