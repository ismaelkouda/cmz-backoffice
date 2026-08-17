import { Injectable, inject } from '@angular/core';
import { MessagingUpdateCommand } from '@pages/communication/application/commands/messaging/messaging-update.command';
import { MessagingUpdateHandler } from '@pages/communication/application/commands-handlers/messaging/messaging-update.handler';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessagingUpdateBus {
    private readonly updateHandler = inject(MessagingUpdateHandler);

    dispatch<T>(command: T): Observable<MessageResponseDto> {
        if (command instanceof MessagingUpdateCommand) {
            return this.updateHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
