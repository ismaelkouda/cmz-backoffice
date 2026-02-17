import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { TasksActionsUpdateCommand } from '@presentation/pages/processing/application/commands/tasks/tasks-actions-update.command';
import { TasksActionsUseCase } from '@presentation/pages/processing/application/use-cases/tasks/tasks-actions.use-case';

@Injectable({ providedIn: 'root' })
export class TasksUpdateHandler {
    constructor(private readonly useCase: TasksActionsUseCase) {}

    execute(
        command: TasksActionsUpdateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.update({
            uniqId: command.uniqId,
            reportUniqId: command.reportUniqId,
            date: command.date,
            type: command.type,
            description: command.description,
            shouldNotifyUser: command.shouldNotifyUser,
        });
    }
}
