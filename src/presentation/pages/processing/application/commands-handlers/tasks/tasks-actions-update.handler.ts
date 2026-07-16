import { tasksActionsUpdateCommandMapper } from '@pages/processing/application/commands-mappers/tasks/tasks-actions-update.mapper';
import { Injectable, inject } from '@angular/core';
import { TasksActionsUpdateCommand } from '@pages/processing/application/commands/tasks/tasks-actions-update.command';
import { TasksActionsUseCase } from '@pages/processing/application/use-cases/tasks/tasks-actions.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TasksUpdateHandler {
    private readonly useCase = inject(TasksActionsUseCase);

    execute(
        command: TasksActionsUpdateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.update(tasksActionsUpdateCommandMapper(command));
    }
}
