import { Injectable, inject } from '@angular/core';
import { NotificationsReadOneCommand } from '@pages/communication/application/commands/notifications/notifications-read-one.command';
import { NotificationsUseCase } from '@pages/communication/application/use-cases/notifications/notifications.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationsReadOneHandler {
    private readonly useCase = inject(NotificationsUseCase);

    execute(
        command: NotificationsReadOneCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.readOne({
            uniqId: command.uniqId,
        });
    }
}
