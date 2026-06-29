import { Injectable, inject } from '@angular/core';
import { MessagingCreateCommand } from '@pages/communication/application/commands/messaging/messaging-create.command';
import { MessagingUseCase } from '@pages/communication/application/use-cases/messaging/messaging.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { messagingCreateCommandMapper } from '@pages/communication/application/commands-mappers/messaging/messaging-create.mapper';

@Injectable({ providedIn: 'root' })
export class MessagingCreateHandler {
    private readonly useCase = inject(MessagingUseCase);

    execute(
        command: MessagingCreateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.create(messagingCreateCommandMapper(command));
    }
}
