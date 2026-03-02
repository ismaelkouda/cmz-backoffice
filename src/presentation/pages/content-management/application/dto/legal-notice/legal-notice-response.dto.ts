import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

export type LegalNoticeResponseDto = PaginatedResponseDto<LegalNoticeItemDto>;

export interface LegalNoticeItemDto {
    id: string;
    name: string;
    content: string;
    is_published: boolean;
    version: string;
    start_date: string;
    end_date: string;
    created_at: string;
    published_at: string;
}
