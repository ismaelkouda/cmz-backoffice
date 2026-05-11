import { Injectable } from '@angular/core';
import { TasksActionsUpdateCommand } from '@pages/processing/application/commands/tasks/tasks-actions-update.command';
import { TasksActionsUseCase } from '@pages/processing/application/use-cases/tasks/tasks-actions.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
            operator: command.operator,
            description: command.description,
            shouldNotifyUser: command.shouldNotifyUser,
            isConform: command.isConform,
        });
    }
}
