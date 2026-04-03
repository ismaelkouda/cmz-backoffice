import { ChatbotFindOneFilterEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-find-one-filter.entity';
import { ChatbotFindOneFilterApiDto } from '@shared/components/management/infrastructure/api/dto/chatbot/chatbot-find-one-filter-api.dto';

export function chatbotFindOneFilterMapper(
    entity: ChatbotFindOneFilterEntity
): ChatbotFindOneFilterApiDto {
    const params: ChatbotFindOneFilterApiDto = {} as ChatbotFindOneFilterApiDto;

    if (entity.uniqId) {
        params.id = entity.uniqId;
    }

    return params;
}
