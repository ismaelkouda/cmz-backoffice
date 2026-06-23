import { MessagingChannelsDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-channels.dto';
import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

export interface MessagingItemApiDto {
    uniq_id: string;
    report_id: string;
    type: string;
    target_type: string;
    region: string;
    department: string;
    municipality: string;
    channels: MessagingChannelsDto[];
    subject: string;
    content: string;
    created_at: string;
    updated_at: string;
}

export type MessagingResponseApiDto = PaginatedResponseDto<MessagingItemApiDto>;
