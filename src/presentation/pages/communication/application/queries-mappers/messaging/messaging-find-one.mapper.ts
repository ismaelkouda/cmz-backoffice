import { MessagingFindOneQuery } from '@pages/communication/application/queries/messaging/messaging-find-one.query';
import { MessagingFindOneFilterDto } from '@pages/communication/application/dto/messaging/messaging-find-one-filter.dto';

export function messagingFindOneQueryMapper(
    query: MessagingFindOneQuery
): MessagingFindOneFilterDto {
    return {
        uniqId: query.uniqId,
    };
}
