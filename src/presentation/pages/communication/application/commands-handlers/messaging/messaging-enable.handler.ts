import { Injectable, inject } from '@angular/core';
import { MessagingEnableCommand } from '@pages/communication/application/commands/messaging/messaging-enable.command';
import { MessagingUseCase } from '@pages/communication/application/use-cases/messaging/messaging.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessagingEnableHandler {
    private readonly useCase = inject(MessagingUseCase);

    execute(
        command: MessagingEnableCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.enable({
            uniqId: command.uniqId,
        });
    }
}
