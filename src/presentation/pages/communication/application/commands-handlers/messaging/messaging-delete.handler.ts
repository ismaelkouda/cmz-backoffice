import { Injectable, inject } from '@angular/core';
import { MessagingDeleteCommand } from '@pages/communication/application/commands/messaging/messaging-delete.command';
import { MessagingUseCase } from '@pages/communication/application/use-cases/messaging/messaging.use-case';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessagingDeleteHandler {
    private readonly useCase = inject(MessagingUseCase);

    execute(command: MessagingDeleteCommand): Observable<MessageResponseDto> {
        return this.useCase.delete({
            uniqId: command.uniqId,
        });
    }
}
