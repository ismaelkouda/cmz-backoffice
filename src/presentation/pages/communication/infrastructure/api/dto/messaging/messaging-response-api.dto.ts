import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

export interface MessagingItemApiDto {
    id: string;
    type: string;
    target_type: string;
    region: string;
    department: string;
    municipality: string;
    channels: string[];
    subject: string;
    content: string;
    message: string;
    created_at: string;
}

export type MessagingResponseApiDto = PaginatedResponseDto<MessagingItemApiDto>;
