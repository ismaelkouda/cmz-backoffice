import { Injectable } from '@angular/core';
import { MessagingEnableCommand } from '@pages/communication/application/commands/messaging/messaging-enable.command';
import { MessagingEnableHandler } from '@pages/communication/application/commands-handlers/messaging/messaging-enable.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
