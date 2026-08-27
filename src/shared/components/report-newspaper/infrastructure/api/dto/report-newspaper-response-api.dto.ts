import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface ReportNewspaperItemApiDto {
    id: string;
    operation: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export type ReportNewspaperResponseApiDto = SimpleResponseDto<
    ReportNewspaperItemApiDto[]
>;
