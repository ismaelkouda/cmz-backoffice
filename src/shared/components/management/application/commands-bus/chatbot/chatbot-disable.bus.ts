import { Injectable } from '@angular/core';
import { ChatbotDisableCommand } from '@shared/components/management/application/commands/chatbot/chatbot-disable.command';
import { ChatbotDisableHandler } from '@shared/components/management/application/commands-handlers/chatbot/chatbot-disable.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatbotDisableBus {
    constructor(private readonly filterHandler: ChatbotDisableHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof ChatbotDisableCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
