import { ChatbotEnableEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-enable.entity';
import { ChatbotEnableApiDto } from '@shared/components/management/infrastructure/api/dto/chatbot/chatbot-enable-api.dto';

export function chatbotEnableMapper(
    vo: ChatbotEnableEntity
): ChatbotEnableApiDto {
    const prams = {} as ChatbotEnableApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
