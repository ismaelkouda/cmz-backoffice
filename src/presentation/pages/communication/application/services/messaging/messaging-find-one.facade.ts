import { inject, Injectable } from '@angular/core';
import { MessagingFindOneFilterDto } from '@pages/communication/application/dto/messaging/messaging-find-one-filter.dto';
import { MessagingFindOneQuery } from '@pages/communication/application/queries/messaging/messaging-find-one.query';
import { MessagingFindOneBus } from '@pages/communication/application/queries-bus/messaging/messaging-find-one.bus';
import { MessagingFindOneEntity } from '@pages/communication/domain/entities/messaging/messaging-find-one.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class MessagingFindOneFacade extends ObjectBaseFacade<
    MessagingFindOneEntity,
    MessagingFindOneFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(MessagingFindOneBus);

    read(filter: MessagingFindOneFilterDto, options: FetchOptions = {}): void {
        const command = new MessagingFindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command, options);
        this.fetch(filter, fetch$, this.ui);
    }
}
