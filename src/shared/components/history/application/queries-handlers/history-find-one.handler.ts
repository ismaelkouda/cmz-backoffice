import { Injectable } from '@angular/core';
import { HistoryFindOneQuery } from '@shared/components/history/application/queries/history-find-one.query';
import { HistoryFindOneUseCase } from '@shared/components/history/application/use-cases/history-find-one.use-case';
import { HistoryFindOneEntity } from '@shared/components/history/domain/entities/history-find-one.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HistoryFindOneHandler {
    constructor(private readonly useCase: HistoryFindOneUseCase) {}

    execute(command: HistoryFindOneQuery): Observable<HistoryFindOneEntity> {
        return this.useCase.read({
            uniqId: command.uniqId,
            typeModel: command.typeModel,
        });
    }
}
