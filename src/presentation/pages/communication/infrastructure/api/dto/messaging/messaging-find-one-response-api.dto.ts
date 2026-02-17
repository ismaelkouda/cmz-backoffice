import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface MessagingFindOneItemApiDto {
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

export type MessagingFindOneResponseApiDto =
    SimpleResponseDto<MessagingFindOneItemApiDto>;
