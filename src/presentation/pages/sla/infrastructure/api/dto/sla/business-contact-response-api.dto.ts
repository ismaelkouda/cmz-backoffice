import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface BusinessContactItemApiDto {
    id: string | number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    is_active: boolean;
    indicators_count?: number;
    sla_count?: number;
    created_at: string;
}

export type BusinessContactResponseApiDto = SimpleResponseDto<
    BusinessContactItemApiDto[]
>;

export interface BusinessContactFreeMemberApiDto {
    id: string | number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
}

export type BusinessContactFreeMembersResponseApiDto = SimpleResponseDto<
    BusinessContactFreeMemberApiDto[]
>;

export interface BusinessContactAddApiDto {
    user_ids: (string | number)[];
}

export interface BusinessContactFilterApiDto {
    search?: string;
    sla_type?: string;
    sla_id?: number;
    is_active?: boolean;
}
