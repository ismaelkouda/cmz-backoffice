import { ChatbotFindOneFilterEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-find-one-filter.entity';
import { ChatbotFindOneEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-find-one.entity';
import { Observable } from 'rxjs';

export abstract class ChatbotFindOneRepository {
    abstract read(
        filter: ChatbotFindOneFilterEntity
    ): Observable<ChatbotFindOneEntity>;
}
