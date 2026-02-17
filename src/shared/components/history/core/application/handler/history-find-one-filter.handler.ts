import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HistoryFindOneEntity } from '../../domain/entities/history-find-one.entity';
import { HistoryFindOneFilterCommand } from '../commands/history-find-one-filter.command';
import { HistoryFindOneUseCase } from '../use-cases/history-find-one.use-case';

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
