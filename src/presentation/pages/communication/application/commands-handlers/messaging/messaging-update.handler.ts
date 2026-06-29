import { Injectable, inject } from '@angular/core';
import { MessagingUpdateCommand } from '@pages/communication/application/commands/messaging/messaging-update.command';
import { MessagingUseCase } from '@pages/communication/application/use-cases/messaging/messaging.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { messagingUpdateCommandMapper } from '@pages/communication/application/commands-mappers/messaging/messaging-update.mapper';

@Injectable({ providedIn: 'root' })
export class MessagingUpdateHandler {
    private readonly useCase = inject(MessagingUseCase);

    execute(
        command: MessagingUpdateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.update(messagingUpdateCommandMapper(command));
    }
}
