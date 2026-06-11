import { ChatbotCreateEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-create.entity';
import { ChatbotDeleteEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-delete.entity';
import { ChatbotDisableEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-disable.entity';
import { ChatbotEnableEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-enable.entity';
import { ChatbotFilterEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-filter.entity';
import { ChatbotUpdateEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-update.entity';
import { ChatbotEntity } from '@shared/components/management/domain/entities/chatbot/chatbot.entity';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class ChatbotRepository {
    abstract readAll(
        entity: ChatbotFilterEntity | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<ChatbotEntity>>;
    abstract create(
        entity: ChatbotCreateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        entity: ChatbotUpdateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(
        entity: ChatbotDeleteEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract enable(
        entity: ChatbotEnableEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract disable(
        entity: ChatbotDisableEntity
    ): Observable<SimpleResponseDto<void>>;
}
