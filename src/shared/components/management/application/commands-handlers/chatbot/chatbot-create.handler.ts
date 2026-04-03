import { Injectable } from '@angular/core';
import { ChatbotCreateCommand } from '@shared/components/management/application/commands/chatbot/chatbot-create.command';
import { ChatbotUseCase } from '@shared/components/management/application/use-cases/chatbot/chatbot.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatbotCreateHandler {
    constructor(private readonly useCase: ChatbotUseCase) {}

    execute(
        command: ChatbotCreateCommand
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
