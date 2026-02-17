import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { MessagingDisableCommand } from '@presentation/pages/communication/application/commands/messaging/messaging-disable.command';
import { MessagingUseCase } from '@presentation/pages/communication/application/use-cases/messaging/messaging.use-case';

@Injectable({ providedIn: 'root' })
export class MessagingDisableHandler {
    constructor(private readonly useCase: MessagingUseCase) {}

    execute(
        command: MessagingDisableCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.disable({
            uniqId: command.uniqId,
        });
    }
}
