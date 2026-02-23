import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface MessagingFindOneItemApiDto {
    uniq_id: string;
    report_uniq_id: string;
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
