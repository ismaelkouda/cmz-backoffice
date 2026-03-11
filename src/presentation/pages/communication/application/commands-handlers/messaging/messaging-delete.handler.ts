import { Injectable } from '@angular/core';
import { MessagingDeleteCommand } from '@pages/communication/application/commands/messaging/messaging-delete.command';
import { MessagingUseCase } from '@pages/communication/application/use-cases/messaging/messaging.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
