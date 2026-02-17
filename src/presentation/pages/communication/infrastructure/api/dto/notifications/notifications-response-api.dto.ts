import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

export interface NotificationsItemApiDto {
    id: string;
    reference: string;
    type: string;
    description: string;
    created_at: string;
}

export type NotificationsResponseApiDto =
    PaginatedResponseDto<NotificationsItemApiDto>;
