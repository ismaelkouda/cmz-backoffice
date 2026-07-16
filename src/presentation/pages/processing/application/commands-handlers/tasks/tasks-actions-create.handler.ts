import { tasksActionsCreateCommandMapper } from '@pages/processing/application/commands-mappers/tasks/tasks-actions-create.mapper';
import { Injectable, inject } from '@angular/core';
import { TasksActionsCreateCommand } from '@pages/processing/application/commands/tasks/tasks-actions-create.command';
import { TasksActionsUseCase } from '@pages/processing/application/use-cases/tasks/tasks-actions.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TasksActionsCreateHandler {
    private readonly useCase = inject(TasksActionsUseCase);

    execute(
        command: TasksActionsCreateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.create(tasksActionsCreateCommandMapper(command));
    }
}
