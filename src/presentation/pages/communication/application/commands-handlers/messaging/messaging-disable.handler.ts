import { Injectable } from '@angular/core';
import { MessagingDisableCommand } from '@pages/communication/application/commands/messaging/messaging-disable.command';
import { MessagingUseCase } from '@pages/communication/application/use-cases/messaging/messaging.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
