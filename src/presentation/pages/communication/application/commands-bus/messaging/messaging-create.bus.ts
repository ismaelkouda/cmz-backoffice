import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { MessagingCreateCommand } from '@presentation/pages/communication/application/commands/messaging/messaging-create.command';
import { MessagingCreateHandler } from '@presentation/pages/communication/application/commands-handlers/messaging/messaging-create.handler';

@Injectable({ providedIn: 'root' })
export class MessagingCreateBus {
    constructor(private readonly createHandler: MessagingCreateHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof MessagingCreateCommand) {
            return this.createHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
