import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

import { ApiStatus } from '@presentation/pages/communication/infrastructure/enums/notifications/notifications-status-api.enum';

export interface NotificationsItemApiDto {
    id: string;
    reference: string;
    title: string;
    type: string;
    message: string;
    status: ApiStatus;
    sent_at: string;
}

export type NotificationsResponseApiDto =
    PaginatedResponseDto<NotificationsItemApiDto>;
