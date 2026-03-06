import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

import { ChannelsDto } from '@presentation/pages/communication/infrastructure/api/dto/messaging/messaging-channels.dto';

export interface MessagingItemApiDto {
    uniq_id: string;
    report_id: string;
    type: string;
    target_type: string;
    region: string;
    department: string;
    municipality: string;
    channels: ChannelsDto[];
    subject: string;
    content: string;
    created_at: string;
}

export type MessagingResponseApiDto = PaginatedResponseDto<MessagingItemApiDto>;
