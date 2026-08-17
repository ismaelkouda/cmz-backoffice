import { Injectable, inject } from '@angular/core';
import { ChatbotEnableCommand } from '@shared/components/management/application/commands/chatbot/chatbot-enable.command';
import { ChatbotEnableHandler } from '@shared/components/management/application/commands-handlers/chatbot/chatbot-enable.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatbotEnableBus {
    private readonly filterHandler = inject(ChatbotEnableHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof ChatbotEnableCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
