import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { TasksActionsCreateCommand } from '@presentation/pages/processing/application/commands/tasks/tasks-actions-create.command';
import { TasksActionsCreateHandler } from '@presentation/pages/processing/application/commands-handlers/tasks/tasks-actions-create.handler';

@Injectable({ providedIn: 'root' })
export class TasksActionsCreateBus {
    constructor(private readonly createHandler: TasksActionsCreateHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof TasksActionsCreateCommand) {
            return this.createHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
