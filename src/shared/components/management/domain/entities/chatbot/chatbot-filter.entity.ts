import { ChatbotFilterVo } from '@shared/components/management/domain/value-objects/chatbot/chatbot-filter.vo';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class ChatbotFilterEntity {
    constructor(
        public readonly reportId?: string,
        public readonly search?: string,
        public readonly targetType?: string,
        public readonly region?: string,
        public readonly department?: string,
        public readonly municipality?: string,
        public readonly channels?: string[],
        public readonly period?: DatePeriod
    ) {}

    static fromVo(vo: ChatbotFilterVo): ChatbotFilterEntity {
        return new ChatbotFilterEntity(
            vo.reportId,
            vo.search,
            vo.targetType,
            vo.region,
            vo.department,
            vo.municipality,
            vo.channels,
            vo.period
        );
    }
}
