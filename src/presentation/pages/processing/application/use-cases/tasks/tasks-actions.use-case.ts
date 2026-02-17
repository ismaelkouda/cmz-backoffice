import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { TasksActionsCreateDto } from '@presentation/pages/processing/application/dto/tasks/tasks-actions-create.dto';
import { TasksActionsDeleteDto } from '@presentation/pages/processing/application/dto/tasks/tasks-actions-delete.dto';
import { TasksActionsFilterDto } from '@presentation/pages/processing/application/dto/tasks/tasks-actions-filter.dto';
import { TasksActionsUpdateDto } from '@presentation/pages/processing/application/dto/tasks/tasks-actions-update.dto';
import { TasksActionsCreateEntity } from '@presentation/pages/processing/domain/entities/tasks/tasks-actions-create.entity';
import { TasksActionsDeleteEntity } from '@presentation/pages/processing/domain/entities/tasks/tasks-actions-delete.entity';
import { TasksActionsFilterEntity } from '@presentation/pages/processing/domain/entities/tasks/tasks-actions-filter.entity';
import { TasksActionsUpdateEntity } from '@presentation/pages/processing/domain/entities/tasks/tasks-actions-update.entity';
import { TasksActionsEntity } from '@presentation/pages/processing/domain/entities/tasks/tasks-actions.entity';
import { TasksActionsRepository } from '@presentation/pages/processing/domain/repositories/tasks/tasks-actions.repository';
import { TasksActionsCreateVo } from '@presentation/pages/processing/domain/value-objects/tasks/tasks-actions-create.vo';
import { TasksActionsDeleteVo } from '@presentation/pages/processing/domain/value-objects/tasks/tasks-actions-delete.vo';
import { TasksActionsFilterVo } from '@presentation/pages/processing/domain/value-objects/tasks/tasks-actions-filter.vo';
import { TasksActionsUpdateVo } from '@presentation/pages/processing/domain/value-objects/tasks/tasks-actions-update.vo';

@Injectable({
    providedIn: 'root',
})
export class TasksActionsUseCase {
    private readonly repository = inject(TasksActionsRepository);

    execute(
        dto: TasksActionsFilterDto,
        page: string
    ): Observable<Paginate<TasksActionsEntity>> {
        const vo = TasksActionsFilterVo.fromDto(dto);
        const entity = TasksActionsFilterEntity.fromVo(vo);
        return this.repository.execute(entity, page);
    }

    create(dto: TasksActionsCreateDto): Observable<SimpleResponseDto<void>> {
        const vo = TasksActionsCreateVo.fromDto(dto);
        const entity = TasksActionsCreateEntity.fromVo(vo);
        return this.repository.create(entity);
    }

    update(dto: TasksActionsUpdateDto): Observable<SimpleResponseDto<void>> {
        const vo = TasksActionsUpdateVo.fromDto(dto);
        const entity = TasksActionsUpdateEntity.fromVo(vo);
        return this.repository.update(entity);
    }

    delete(dto: TasksActionsDeleteDto): Observable<SimpleResponseDto<void>> {
        const vo = TasksActionsDeleteVo.fromDto(dto);
        const entity = TasksActionsDeleteEntity.fromVo(vo);
        return this.repository.delete(entity);
    }
}
