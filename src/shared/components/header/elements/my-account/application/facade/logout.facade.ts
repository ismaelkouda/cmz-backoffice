import { inject, Injectable } from '@angular/core';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { MessageEntity } from '@shared/domain/entities/message.entity';
import { LogoutBus } from '../commands-bus/logout.bus';
import { AuthFacade } from './auth.facade';

@Injectable({ providedIn: 'root' })
export class LogoutFacade extends ObjectBaseFacade<MessageEntity, null> {
    private readonly bus = inject(LogoutBus);
    private readonly authFacade = inject(AuthFacade);

    execute(): void {
        this.bus.dispatch().subscribe({
            next: () => {
                this.authFacade.logout();
            },
        });
    }
}
