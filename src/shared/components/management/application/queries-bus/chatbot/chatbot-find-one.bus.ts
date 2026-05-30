import { Injectable, inject } from '@angular/core';
import { ChatbotFindOneQuery } from '@shared/components/management/application/queries/chatbot/chatbot-find-one.query';
import { ChatbotFindOneHandler } from '@shared/components/management/application/queries-handlers/chatbot/chatbot-find-one.handler';
import { ChatbotFindOneEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-find-one.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatbotFindOneBus {
    private readonly filterHandler = inject(ChatbotFindOneHandler);

    dispatch<T>(query: T): Observable<ChatbotFindOneEntity> {
        if (query instanceof ChatbotFindOneQuery) {
            return this.filterHandler.execute(query);
        }

        throw new Error('No handler found for query');
    }
}
