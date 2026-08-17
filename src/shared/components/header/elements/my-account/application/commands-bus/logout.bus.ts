import { inject, Injectable } from '@angular/core';
import { LogoutHandler } from '../commands-handlers/logout.handler';
import { Observable } from 'rxjs';
import { MessageEntity } from '@shared/domain/entities/message.entity';

@Injectable({ providedIn: 'root' })
export class LogoutBus {
    private readonly handler = inject(LogoutHandler);

    dispatch(): Observable<MessageEntity> {
        return this.handler.execute();
    }
}
