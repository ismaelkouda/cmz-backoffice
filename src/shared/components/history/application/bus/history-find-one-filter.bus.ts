import { Injectable } from '@angular/core';
import { HistoryFindOneFilterCommand } from '@shared/components/history/application/commands/history-find-one-filter.command';
import { HistoryFindOneFilterHandler } from '@shared/components/history/application/handler/history-find-one-filter.handler';
import { HistoryFindOneEntity } from '@shared/components/history/domain/entities/history-find-one.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HistoryFindOneFilterBus {
    constructor(private readonly filterHandler: HistoryFindOneFilterHandler) {}

    dispatch<T>(command: T): Observable<HistoryFindOneEntity> {
        if (command instanceof HistoryFindOneFilterCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
