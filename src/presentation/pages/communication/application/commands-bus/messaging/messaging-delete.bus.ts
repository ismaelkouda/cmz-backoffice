import { Injectable, inject } from '@angular/core';
import { MessagingDeleteCommand } from '@pages/communication/application/commands/messaging/messaging-delete.command';
import { MessagingDeleteHandler } from '@pages/communication/application/commands-handlers/messaging/messaging-delete.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessagingDeleteBus {
    private readonly filterHandler = inject(MessagingDeleteHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof MessagingDeleteCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
