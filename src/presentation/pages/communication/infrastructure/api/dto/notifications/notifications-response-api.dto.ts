import { TypeReportApiDto } from '@pages/communication/infrastructure/api/dto/notifications/notifications-type-report-api.dto';
import { ApiStatus } from '@pages/communication/infrastructure/enums/notifications/notifications-status-api.enum';
import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

export interface NotificationsItemApiDto {
    id: string;
    reference: string;
    title: string;
    type: string;
    message: string;
    status: ApiStatus;
    model_id: string;
    model_type: TypeReportApiDto;
    sent_at: string;
    updated_at: string;
}

export type NotificationsResponseApiDto =
    PaginatedResponseDto<NotificationsItemApiDto>;
