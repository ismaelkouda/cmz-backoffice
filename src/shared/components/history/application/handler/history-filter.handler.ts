import { Injectable } from '@angular/core';
import { HistoryFilterCommand } from '@shared/components/history/application/commands/history-filter.command';
import { HistoryUseCase } from '@shared/components/history/application/use-cases/history.use-case';
import { HistoryEntity } from '@shared/components/history/domain/entities/history.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HistoryFilterHandler {
    constructor(private readonly useCase: HistoryUseCase) {}

    execute(
        command: HistoryFilterCommand,
        page: string
    ): Observable<Paginate<HistoryEntity>> {
        return this.useCase.execute(
            {
                typeModel: command.typeModel,
                module: command.module,
                search: command.search,
                startDate: command.startDate,
                endDate: command.endDate,
            },
            page
        );
    }
}
