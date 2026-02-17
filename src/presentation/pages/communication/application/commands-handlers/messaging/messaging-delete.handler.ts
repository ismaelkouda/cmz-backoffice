import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { MessagingDeleteCommand } from '@presentation/pages/communication/application/commands/messaging/messaging-delete.command';
import { MessagingUseCase } from '@presentation/pages/communication/application/use-cases/messaging/messaging.use-case';

@Injectable({ providedIn: 'root' })
export class MessagingDeleteHandler {
    constructor(private readonly useCase: MessagingUseCase) {}

    execute(
        command: MessagingDeleteCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.delete({
            uniqId: command.uniqId,
        });
    }
}
