import { ChatbotFindOneFilterEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-find-one-filter.entity';
import { ChatbotFindOneEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class ChatbotFindOneRepository {
    abstract read(
        filter: ChatbotFindOneFilterEntity,
        options?: FetchOptions
    ): Observable<ChatbotFindOneEntity>;
}
