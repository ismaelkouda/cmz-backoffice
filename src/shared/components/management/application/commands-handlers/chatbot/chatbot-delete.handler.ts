import { Injectable, inject } from '@angular/core';
import { ChatbotDeleteCommand } from '@shared/components/management/application/commands/chatbot/chatbot-delete.command';
import { ChatbotUseCase } from '@shared/components/management/application/use-cases/chatbot/chatbot.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatbotDeleteHandler {
    private readonly useCase = inject(ChatbotUseCase);

    execute(
        command: ChatbotDeleteCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.delete({
            uniqId: command.uniqId,
        });
    }
}
