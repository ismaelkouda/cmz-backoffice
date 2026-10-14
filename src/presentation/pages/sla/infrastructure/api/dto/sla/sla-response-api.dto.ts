import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface SlaItemApiDto {
    id: number;
    name: string;
    description: string;
    order: number;
    type: string;
    category: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    report_slas_count: number;
    report_types_count: number;
}

export type SlaResponseApiDto = SimpleResponseDto<SlaItemApiDto[]>;
