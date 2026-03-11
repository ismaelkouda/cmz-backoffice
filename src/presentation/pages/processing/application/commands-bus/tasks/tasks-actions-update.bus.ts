import { Injectable } from '@angular/core';
import { TasksActionsUpdateCommand } from '@pages/processing/application/commands/tasks/tasks-actions-update.command';
import { TasksUpdateHandler } from '@pages/processing/application/commands-handlers/tasks/tasks-actions-update.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TasksActionsUpdateBus {
    constructor(private readonly updateHandler: TasksUpdateHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof TasksActionsUpdateCommand) {
            return this.updateHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
