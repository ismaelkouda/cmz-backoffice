import { PaginatedResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface NotificationsItemDto {
    uniq_id: string;
    type: string;
    message: string;
    created_at: string;
}

export interface NotificationsResponseDto extends PaginatedResponseDto<NotificationsItemDto> { }
