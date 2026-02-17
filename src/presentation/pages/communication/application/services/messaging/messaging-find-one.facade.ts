import { inject, Injectable } from '@angular/core';

import { shouldFetch } from '@shared/application/services/facade.utils';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

import { MessagingFindOneFilterDto } from '@presentation/pages/communication/application/dto/messaging/messaging-find-one-filter.dto';
import { MessagingFindOneQuery } from '@presentation/pages/communication/application/queries/messaging/messaging-find-one.query';
import { MessagingFindOneBus } from '@presentation/pages/communication/application/queries-bus/messaging/messaging-find-one.bus';
import { MessagingFindOneEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging-find-one.entity';

@Injectable({
    providedIn: 'root',
})
export class MessagingFindOneFacade extends ObjectBaseFacade<
    MessagingFindOneEntity,
    MessagingFindOneFilterDto
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly bus = inject(MessagingFindOneBus);

    readonly item$ = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    read(filter: MessagingFindOneFilterDto, forceRefresh = false): void {
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
        const command = new MessagingFindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command);
        this.fetchWithFilter(filter, fetch$, this.uiFeedbackService);

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }
}
