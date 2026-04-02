import { Injectable } from '@angular/core';
import { ChatbotCreateCommand } from '@shared/components/management/application/commands/chatbot/chatbot-create.command';
import { ChatbotCreateHandler } from '@shared/components/management/application/commands-handlers/chatbot/chatbot-create.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatbotCreateBus {
    constructor(private readonly createHandler: ChatbotCreateHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof ChatbotCreateCommand) {
            return this.createHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
