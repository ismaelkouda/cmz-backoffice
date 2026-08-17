import { Injectable, inject } from '@angular/core';
import { MessagingUpdateCommand } from '@pages/communication/application/commands/messaging/messaging-update.command';
import { MessagingUseCase } from '@pages/communication/application/use-cases/messaging/messaging.use-case';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { messagingUpdateCommandMapper } from '@pages/communication/application/commands-mappers/messaging/messaging-update.mapper';

@Injectable({ providedIn: 'root' })
export class MessagingUpdateHandler {
    private readonly useCase = inject(MessagingUseCase);

    execute(command: MessagingUpdateCommand): Observable<MessageResponseDto> {
        return this.useCase.update(messagingUpdateCommandMapper(command));
    }
}
