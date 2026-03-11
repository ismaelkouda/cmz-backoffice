import { MessagingFilterVo } from '@pages/communication/domain/value-objects/messaging/messaging-filter.vo';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class MessagingFilterEntity {
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

    static fromVo(vo: MessagingFilterVo): MessagingFilterEntity {
        return new MessagingFilterEntity(
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
