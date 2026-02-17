import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { MessagingEnableCommand } from '@presentation/pages/communication/application/commands/messaging/messaging-enable.command';
import { MessagingEnableHandler } from '@presentation/pages/communication/application/commands-handlers/messaging/messaging-enable.handler';

@Injectable({ providedIn: 'root' })
export class MessagingEnableBus {
    constructor(private readonly filterHandler: MessagingEnableHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof MessagingEnableCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
