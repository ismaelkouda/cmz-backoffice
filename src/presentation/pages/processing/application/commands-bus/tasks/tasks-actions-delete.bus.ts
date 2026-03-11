import { Injectable } from '@angular/core';
import { TasksActionsDeleteCommand } from '@pages/processing/application/commands/tasks/tasks-actions-delete.command';
import { TasksActionsDeleteHandler } from '@pages/processing/application/commands-handlers/tasks/tasks-actions-delete.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
