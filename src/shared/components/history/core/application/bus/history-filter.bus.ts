import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { HistoryEntity } from '../../domain/entities/history.entity';
import { HistoryFilterCommand } from '../commands/history-filter.command';
import { HistoryFilterHandler } from '../handler/history-filter.handler';

@Injectable({ providedIn: 'root' })
export class HistoryFilterBus {
    constructor(private readonly filterHandler: HistoryFilterHandler) {}

    dispatch<T>(command: T, page: string): Observable<Paginate<HistoryEntity>> {
        if (command instanceof HistoryFilterCommand) {
            return this.filterHandler.execute(command, page);
        }

        throw new Error('No handler found for command');
    }
}
