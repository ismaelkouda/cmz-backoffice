import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface BusinessContactSlaItemApiDto {
    id: string | number;
    sla_id: number;
    sla_type?: string;
    sla_name: string;
    sla_description?: string;
    sla_category?: string;
    report_type_id?: number;
    report_type?: string;
    report_type_name?: string;
    threshold?: string | number;
    unit?: string;
    channel?: string;
    created_at?: string;
    updated_at?: string;
}

export type BusinessContactSlaResponseApiDto = SimpleResponseDto<
    BusinessContactSlaItemApiDto[]
>;

export interface BusinessContactAvailableSlaItemApiDto {
    id: number;
    name: string;
    type: string;
    is_active: boolean;
    category: string;
    description: string;
    order: number;
    created_at: string;
    updated_at: string;
}

export type BusinessContactAvailableSlaResponseApiDto = SimpleResponseDto<
    BusinessContactAvailableSlaItemApiDto[]
>;

export interface BusinessContactSlaFilterApiDto {
    sla_type?: string;
    sla_id?: number;
    sla_category?: string;
}

export interface BusinessContactSlaIdsApiDto {
    sla_ids: (string | number)[];
}
export interface BusinessContactSlaRemoveIdsApiDto {
    ids: (string | number)[];
}
