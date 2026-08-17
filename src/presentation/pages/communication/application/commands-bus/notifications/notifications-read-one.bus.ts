import { Injectable, inject } from '@angular/core';
import { NotificationsReadOneCommand } from '@pages/communication/application/commands/notifications/notifications-read-one.command';
import { NotificationsReadOneHandler } from '@pages/communication/application/commands-handlers/notifications/notifications-read-one.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationsReadOneBus {
    private readonly filterHandler = inject(NotificationsReadOneHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof NotificationsReadOneCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
