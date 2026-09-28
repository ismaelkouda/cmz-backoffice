import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface SlaItemApiDto {
    id: string;
    name: string;
    description: string;
    order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    type: string;
    category: string;
    report_slas_count: number;
    report_types_count: number;
}

export type SlaResponseApiDto = SimpleResponseDto<SlaItemApiDto[]>;
