import { Injectable, inject } from '@angular/core';
import { MessagingDisableCommand } from '@pages/communication/application/commands/messaging/messaging-disable.command';
import { MessagingDisableHandler } from '@pages/communication/application/commands-handlers/messaging/messaging-disable.handler';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessagingDisableBus {
    private readonly filterHandler = inject(MessagingDisableHandler);

    dispatch<T>(command: T): Observable<MessageResponseDto> {
        if (command instanceof MessagingDisableCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
