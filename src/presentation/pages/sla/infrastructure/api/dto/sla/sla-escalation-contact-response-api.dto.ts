import {
    PaginatedResponseDto,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

export interface SlaEscalationContactItemApiDto {
    id: string;
    type: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone: string | null;
    whatsapp?: string | null;
    telegram?: string | null;
    job_title?: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type SlaEscalationContactsResponseApiDto =
    PaginatedResponseDto<SlaEscalationContactItemApiDto>;
export type SlaEscalationContactResponseApiDto =
    SimpleResponseDto<SlaEscalationContactItemApiDto>;

export interface SlaEscalationContactFilterApiDto {
    search?: string;
}

export interface SlaEscalationContactPayloadApiDto {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    job_title?: string;
    whatsapp?: string;
    telegram?: string;
}
