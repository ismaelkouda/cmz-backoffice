import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HistoryFindOneEntity } from '../../domain/entities/history-find-one.entity';
import { HistoryFindOneFilterCommand } from '../commands/history-find-one-filter.command';
import { HistoryFindOneFilterHandler } from '../handler/history-find-one-filter.handler';

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
