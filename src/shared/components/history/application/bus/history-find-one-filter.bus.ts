import { Injectable, inject } from '@angular/core';
import { HistoryFindOneFilterCommand } from '@shared/components/history/application/commands/history-find-one-filter.command';
import { HistoryFindOneFilterHandler } from '@shared/components/history/application/handler/history-find-one-filter.handler';
import { HistoryFindOneEntity } from '@shared/components/history/domain/entities/history-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HistoryFindOneFilterBus {
    private readonly filterHandler = inject(HistoryFindOneFilterHandler);

    dispatch<T>(
        command: T,
        options?: FetchOptions
    ): Observable<HistoryFindOneEntity> {
        if (command instanceof HistoryFindOneFilterCommand) {
            return this.filterHandler.execute(command, options);
        }

        throw new Error('No handler found for command');
    }
}
