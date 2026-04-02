import { ChatbotDeleteEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-delete.entity';
import { ChatbotDeleteApiDto } from '@shared/components/management/infrastructure/api/dto/chatbot/chatbot-delete-api.dto';

export function chatbotDeleteMapper(
    vo: ChatbotDeleteEntity
): ChatbotDeleteApiDto {
    const prams = {} as ChatbotDeleteApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
