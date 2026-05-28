import { Injectable, inject } from '@angular/core';
import { MessagingCreateCommand } from '@pages/communication/application/commands/messaging/messaging-create.command';
import { MessagingUseCase } from '@pages/communication/application/use-cases/messaging/messaging.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessagingCreateHandler {
    private readonly useCase = inject(MessagingUseCase);

    execute(
        command: MessagingCreateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.create({
            reportId: command.reportId,
            type: command.type,
            targetType: command.targetType,
            region: command.region,
            department: command.department,
            municipality: command.municipality,
            channels: command.channels,
            subject: command.subject,
            content: command.content,
        });
    }
}
