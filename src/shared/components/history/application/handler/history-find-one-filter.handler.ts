import { Injectable, inject } from '@angular/core';
import { HistoryFindOneFilterCommand } from '@shared/components/history/application/commands/history-find-one-filter.command';
import { HistoryFindOneUseCase } from '@shared/components/history/application/use-cases/history-find-one.use-case';
import { HistoryFindOneEntity } from '@shared/components/history/domain/entities/history-find-one.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HistoryFindOneFilterHandler {
    private readonly useCase = inject(HistoryFindOneUseCase);

    execute(
        command: HistoryFindOneFilterCommand
    ): Observable<HistoryFindOneEntity> {
        return this.useCase.read({
            uniqId: command.uniqId,
            typeModel: command.typeModel,
        });
    }
}
