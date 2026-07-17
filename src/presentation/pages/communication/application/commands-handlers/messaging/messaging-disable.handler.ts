import { Injectable, inject } from '@angular/core';
import { messagingDisableCommandMapper } from '@pages/communication/application/commands-mappers/messaging/messaging-disable.mapper';
import { MessagingDisableCommand } from '@pages/communication/application/commands/messaging/messaging-disable.command';
import { MessagingUseCase } from '@pages/communication/application/use-cases/messaging/messaging.use-case';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessagingDisableHandler {
    private readonly useCase = inject(MessagingUseCase);

    execute(command: MessagingDisableCommand): Observable<MessageResponseDto> {
        return this.useCase.disable(messagingDisableCommandMapper(command));
    }
}
