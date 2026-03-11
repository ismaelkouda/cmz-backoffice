import { Injectable } from '@angular/core';
import { TasksActionsCreateCommand } from '@pages/processing/application/commands/tasks/tasks-actions-create.command';
import { TasksActionsCreateHandler } from '@pages/processing/application/commands-handlers/tasks/tasks-actions-create.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
