import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface MessagingFindOneItemApiDto {
    id: string;
    report_id: string;
    type: string;
    target_type: string;
    region: string;
    department: string;
    municipality: string;
    channels: string[];
    subject: string;
    content: string;
    created_at: string;
}

export type MessagingFindOneResponseApiDto =
    SimpleResponseDto<MessagingFindOneItemApiDto>;
