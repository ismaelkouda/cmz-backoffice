import {
    PaginatedResponseDto,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

export interface SlaEscalationContactItemApiDto {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    phone_secondary: string | null;
    job_title?: string | null;
    is_active: boolean;
    categories: string[];
    created_at: string;
    updated_at: string;
}

export type SlaEscalationContactsResponseApiDto =
    PaginatedResponseDto<SlaEscalationContactItemApiDto>;
export type SlaEscalationContactResponseApiDto =
    SimpleResponseDto<SlaEscalationContactItemApiDto>;

export interface SlaEscalationContactFilterApiDto {
    search?: string;
    categories?: string[];
}

export interface SlaEscalationContactPayloadApiDto {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    categories: string[];
}
