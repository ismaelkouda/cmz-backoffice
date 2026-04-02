import { ChatbotUpdateEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-update.entity';
import { ChatbotUpdateApiDto } from '@shared/components/management/infrastructure/api/dto/chatbot/chatbot-update-api.dto';

export function chatbotUpdateMapper(
    entity: ChatbotUpdateEntity
): ChatbotUpdateApiDto {
    const params: ChatbotUpdateApiDto = {} as ChatbotUpdateApiDto;

    if (entity.reportId) {
        params.report_uniq_id = entity.reportId;
    }
    if (entity.uniqId) {
        params.id = entity.uniqId;
    }
    if (entity.type) {
        params.type = entity.type;
    }
    if (entity.targetType) {
        params.target_type = entity.targetType;
    }
    if (entity.region) {
        params.region = entity.region;
    }
    if (entity.department) {
        params.department = entity.department;
    }
    if (entity.municipality) {
        params.municipality = entity.municipality;
    }
    if (entity.channels) {
        params.channels = entity.channels;
    }
    if (entity.subject) {
        params.subject = entity.subject;
    }
    if (entity.content) {
        params.content = entity.content;
    }

    return params;
}
