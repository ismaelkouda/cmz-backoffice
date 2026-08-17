import { MessagingFilterContract } from '@presentation/pages/communication/domain/contracts/messaging/messaging-filter.contract';
import { MessagingQuery } from '@pages/communication/application/queries/messaging/messaging.query';

export function messagingQueryMapper(
    query: MessagingQuery
): MessagingFilterContract {
    return {
        reportId: query.reportId,
        search: query.search,
        targetType: query.targetType,
        region: query.region,
        department: query.department,
        municipality: query.municipality,
        channels: query.channels,
        startDate: query.startDate,
        endDate: query.endDate,
    };
}
