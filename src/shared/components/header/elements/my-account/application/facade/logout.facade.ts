import { inject, Injectable } from '@angular/core';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { MessageEntity } from '@shared/domain/entities/message.entity';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { LogoutBus } from '../commands-bus/logout.bus';

@Injectable({ providedIn: 'root' })
export class LogoutFacade extends ObjectBaseFacade<MessageEntity, null> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(LogoutBus);

    execute(): void {
        const fetch$ = this.bus.dispatch();
        this.fetch(null, fetch$, this.ui);
    }
}
