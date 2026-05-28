import { Injectable, inject } from '@angular/core';
import { ChatbotUpdateCommand } from '@shared/components/management/application/commands/chatbot/chatbot-update.command';
import { ChatbotUpdateHandler } from '@shared/components/management/application/commands-handlers/chatbot/chatbot-update.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatbotUpdateBus {
    private readonly updateHandler = inject(ChatbotUpdateHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof ChatbotUpdateCommand) {
            return this.updateHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
