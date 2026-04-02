import { ChannelsDto } from '@shared/components/management/infrastructure/api/dto/chatbot/chatbot-channels.dto';
import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

export interface ChatbotItemApiDto {
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
    updated_at: string;
}

export type ChatbotResponseApiDto = PaginatedResponseDto<ChatbotItemApiDto>;
