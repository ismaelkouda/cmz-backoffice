import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { TasksActionsDeleteCommand } from '@presentation/pages/processing/application/commands/tasks/tasks-actions-delete.command';
import { TasksActionsDeleteHandler } from '@presentation/pages/processing/application/commands-handlers/tasks/tasks-actions-delete.handler';

@Injectable({ providedIn: 'root' })
export class TasksActionsDeleteBus {
    constructor(private readonly filterHandler: TasksActionsDeleteHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof TasksActionsDeleteCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
