import { inject, Injectable } from '@angular/core';
import { MessagingFindOneFilterDto } from '@pages/communication/application/dto/messaging/messaging-find-one-filter.dto';
import { MessagingFindOneQuery } from '@pages/communication/application/queries/messaging/messaging-find-one.query';
import { MessagingFindOneBus } from '@pages/communication/application/queries-bus/messaging/messaging-find-one.bus';
import { MessagingFindOneEntity } from '@pages/communication/domain/entities/messaging/messaging-find-one.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

@Injectable({
    providedIn: 'root',
})
export class MessagingFindOneFacade extends ObjectBaseFacade<
    MessagingFindOneEntity,
    MessagingFindOneFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(MessagingFindOneBus);

    private readonly STALE_TIME = 2 * 60 * 1000;

    read(filter: MessagingFindOneFilterDto, force = false): void {
        const command = new MessagingFindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command);
        this.fetch(filter, fetch$, this.ui, this.STALE_TIME, force);
    }
}
