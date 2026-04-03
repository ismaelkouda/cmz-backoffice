import { Injectable } from '@angular/core';
import { ChatbotDisableCommand } from '@shared/components/management/application/commands/chatbot/chatbot-disable.command';
import { ChatbotUseCase } from '@shared/components/management/application/use-cases/chatbot/chatbot.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatbotDisableHandler {
    constructor(private readonly useCase: ChatbotUseCase) {}

    execute(
        command: ChatbotDisableCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.disable({
            uniqId: command.uniqId,
        });
    }
}
