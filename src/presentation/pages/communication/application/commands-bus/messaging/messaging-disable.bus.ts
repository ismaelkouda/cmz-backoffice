import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { MessagingDisableCommand } from '@presentation/pages/communication/application/commands/messaging/messaging-disable.command';
import { MessagingDisableHandler } from '@presentation/pages/communication/application/commands-handlers/messaging/messaging-disable.handler';

@Injectable({ providedIn: 'root' })
export class MessagingDisableBus {
    constructor(private readonly filterHandler: MessagingDisableHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof MessagingDisableCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
