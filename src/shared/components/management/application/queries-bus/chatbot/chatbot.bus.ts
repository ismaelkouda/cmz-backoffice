import { Injectable, inject } from '@angular/core';
import { ChatbotQuery } from '@shared/components/management/application/queries/chatbot/chatbot.query';
import { ChatbotHandler } from '@shared/components/management/application/queries-handlers/chatbot/chatbot.handler';
import { ChatbotEntity } from '@shared/components/management/domain/entities/chatbot/chatbot.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class ChatbotBus {
    private readonly filterHandler = inject(ChatbotHandler);

    dispatch<T>(
        query: T,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<ChatbotEntity>> {
        if (query instanceof ChatbotQuery) {
            return this.filterHandler.execute(query, page, options);
        }

        throw new Error('No handler found for query');
    }
}
