import { inject, Injectable } from '@angular/core';

import { shouldFetch } from '@shared/application/services/facade.utils';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

import { HistoryFindOneEntity } from '../../domain/entities/history-find-one.entity';
import { HistoryFindOneFilterBus } from '../bus/history-find-one-filter.bus';
import { HistoryFindOneFilterCommand } from '../commands/history-find-one-filter.command';
import { HistoryFindOneFilterDto } from '../dtos/history-findone-filter.dto';

@Injectable({
    providedIn: 'root',
})
export class HistoryFindOneFacade extends ObjectBaseFacade<
    HistoryFindOneEntity,
    HistoryFindOneFilterDto
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly filterBus = inject(HistoryFindOneFilterBus);

    readonly item$ = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    read(filter: HistoryFindOneFilterDto, forceRefresh = false): void {
        const hasData = this.itemsSubject.getValue() !== null;
        if (
            !shouldFetch(
                forceRefresh,
                hasData,
                this.lastFetchTimestamp,
                this.STALE_TIME
            )
        ) {
            return;
        }

        const command = new HistoryFindOneFilterCommand(filter.uniqId);
        const fetch$ = this.filterBus.dispatch(command);

        this.fetchWithFilter(filter, fetch$, this.uiFeedbackService);

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }
}
