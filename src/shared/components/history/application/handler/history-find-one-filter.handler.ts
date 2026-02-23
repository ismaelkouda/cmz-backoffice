import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HistoryFindOneFilterCommand } from '@shared/components/history/application/commands/history-find-one-filter.command';
import { HistoryFindOneUseCase } from '@shared/components/history/application/use-cases/history-find-one.use-case';
import { HistoryFindOneEntity } from '@shared/components/history/domain/entities/history-find-one.entity';

@Injectable({ providedIn: 'root' })
export class HistoryFindOneFilterHandler {
    constructor(private readonly useCase: HistoryFindOneUseCase) {}

    execute(
        command: HistoryFindOneFilterCommand
    ): Observable<HistoryFindOneEntity> {
        return this.useCase.execute({
            uniqId: command.uniqId,
        });
    }
}
