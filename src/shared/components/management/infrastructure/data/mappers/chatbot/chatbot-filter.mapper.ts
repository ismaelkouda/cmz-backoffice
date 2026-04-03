import { ChatbotFilterEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-filter.entity';
import { ChatbotFilterApiDto } from '@shared/components/management/infrastructure/api/dto/chatbot/chatbot-filter-api.dto';

export function chatbotFilterMapper(
    entity: ChatbotFilterEntity
): ChatbotFilterApiDto {
    const params: ChatbotFilterApiDto = {} as ChatbotFilterApiDto;

    if (entity.reportId) {
        params.report_id = entity.reportId;
    }
    if (entity.search) {
        params.search = entity.search;
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
    if (entity.department) {
        params.department = entity.department;
    }
    if (entity.municipality) {
        params.municipality = entity.municipality;
    }
    if (entity.period?.start) {
        params.start_date = entity.period.start;
    }
    if (entity.period?.end) {
        params.end_date = entity.period.end;
    }

    return params;
}
