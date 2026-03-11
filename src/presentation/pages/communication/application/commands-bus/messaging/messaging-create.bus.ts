import { Injectable } from '@angular/core';
import { MessagingCreateCommand } from '@pages/communication/application/commands/messaging/messaging-create.command';
import { MessagingCreateHandler } from '@pages/communication/application/commands-handlers/messaging/messaging-create.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
