import { Injectable, inject } from '@angular/core';
import { TasksActionsDeleteCommand } from '@pages/processing/application/commands/tasks/tasks-actions-delete.command';
import { TasksActionsUseCase } from '@pages/processing/application/use-cases/tasks/tasks-actions.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TasksActionsDeleteHandler {
    private readonly useCase = inject(TasksActionsUseCase);

    execute(
        command: TasksActionsDeleteCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.delete({
            uniqId: command.uniqId,
        });
    }
}
