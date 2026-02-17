import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { HistoryEntity } from '../../domain/entities/history.entity';
import { HistoryFilterCommand } from '../commands/history-filter.command';
import { HistoryUseCase } from '../use-cases/history.use-case';

@Injectable({ providedIn: 'root' })
export class HistoryFilterHandler {
    constructor(private readonly useCase: HistoryUseCase) {}

    execute(
        command: HistoryFilterCommand,
        page: string
    ): Observable<Paginate<HistoryEntity>> {
        return this.useCase.execute(
            {
                search: command.search,
                startDate: command.startDate,
                endDate: command.endDate,
            },
            page
        );
    }
}
