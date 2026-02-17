import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { MessagingEnableCommand } from '@presentation/pages/communication/application/commands/messaging/messaging-enable.command';
import { MessagingUseCase } from '@presentation/pages/communication/application/use-cases/messaging/messaging.use-case';

@Injectable({ providedIn: 'root' })
export class MessagingEnableHandler {
    constructor(private readonly useCase: MessagingUseCase) {}

    execute(
        command: MessagingEnableCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.enable({
            uniqId: command.uniqId,
        });
    }
}
