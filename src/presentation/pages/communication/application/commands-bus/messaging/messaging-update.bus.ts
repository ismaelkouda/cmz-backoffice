import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { MessagingUpdateCommand } from '@presentation/pages/communication/application/commands/messaging/messaging-update.command';
import { MessagingUpdateHandler } from '@presentation/pages/communication/application/commands-handlers/messaging/messaging-update.handler';

@Injectable({ providedIn: 'root' })
export class MessagingUpdateBus {
    constructor(private readonly updateHandler: MessagingUpdateHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof MessagingUpdateCommand) {
            return this.updateHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
