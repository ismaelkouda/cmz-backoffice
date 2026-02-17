import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { MessagingDeleteCommand } from '@presentation/pages/communication/application/commands/messaging/messaging-delete.command';
import { MessagingDeleteHandler } from '@presentation/pages/communication/application/commands-handlers/messaging/messaging-delete.handler';

@Injectable({ providedIn: 'root' })
export class MessagingDeleteBus {
    constructor(private readonly filterHandler: MessagingDeleteHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof MessagingDeleteCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
