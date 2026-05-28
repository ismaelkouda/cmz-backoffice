import { Injectable, inject } from '@angular/core';
import { ChatbotDeleteCommand } from '@shared/components/management/application/commands/chatbot/chatbot-delete.command';
import { ChatbotDeleteHandler } from '@shared/components/management/application/commands-handlers/chatbot/chatbot-delete.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatbotDeleteBus {
    private readonly filterHandler = inject(ChatbotDeleteHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof ChatbotDeleteCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
