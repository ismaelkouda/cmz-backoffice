import { ChatbotDisableEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-disable.entity';
import { ChatbotDisableApiDto } from '@shared/components/management/infrastructure/api/dto/chatbot/chatbot-disable-api.dto';

export function chatbotDisableMapper(
    vo: ChatbotDisableEntity
): ChatbotDisableApiDto {
    const prams = {} as ChatbotDisableApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
