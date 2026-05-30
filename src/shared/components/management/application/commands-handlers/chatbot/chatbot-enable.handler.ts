import { Injectable, inject } from '@angular/core';
import { ChatbotEnableCommand } from '@shared/components/management/application/commands/chatbot/chatbot-enable.command';
import { ChatbotUseCase } from '@shared/components/management/application/use-cases/chatbot/chatbot.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatbotEnableHandler {
    private readonly useCase = inject(ChatbotUseCase);

    execute(
        command: ChatbotEnableCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.enable({
            uniqId: command.uniqId,
        });
    }
}
