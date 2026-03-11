import { Injectable } from '@angular/core';
import { HistoryFilterCommand } from '@shared/components/history/application/commands/history-filter.command';
import { HistoryFilterHandler } from '@shared/components/history/application/handler/history-filter.handler';
import { HistoryEntity } from '@shared/components/history/domain/entities/history.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
