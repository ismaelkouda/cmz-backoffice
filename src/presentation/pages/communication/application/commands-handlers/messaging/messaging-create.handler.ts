import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { MessagingCreateCommand } from '@presentation/pages/communication/application/commands/messaging/messaging-create.command';
import { MessagingUseCase } from '@presentation/pages/communication/application/use-cases/messaging/messaging.use-case';

@Injectable({ providedIn: 'root' })
export class MessagingCreateHandler {
    constructor(private readonly useCase: MessagingUseCase) {}

    execute(
        command: MessagingCreateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.create({
            type: command.type,
            targetType: command.targetType,
            region: command.region,
            department: command.department,
            municipality: command.municipality,
            channels: command.channels,
            subject: command.subject,
            content: command.content,
            message: command.message,
        });
    }
}
