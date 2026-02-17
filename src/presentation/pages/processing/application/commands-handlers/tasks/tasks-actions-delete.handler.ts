import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { TasksActionsDeleteCommand } from '@presentation/pages/processing/application/commands/tasks/tasks-actions-delete.command';
import { TasksActionsUseCase } from '@presentation/pages/processing/application/use-cases/tasks/tasks-actions.use-case';

@Injectable({ providedIn: 'root' })
export class TasksActionsDeleteHandler {
    constructor(private readonly useCase: TasksActionsUseCase) {}

    execute(
        command: TasksActionsDeleteCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.delete({
            uniqId: command.uniqId,
        });
    }
}
