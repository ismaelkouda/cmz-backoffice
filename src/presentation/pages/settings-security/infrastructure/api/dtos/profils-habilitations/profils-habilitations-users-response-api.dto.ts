import { PaginatedResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface ProfilsHabilitationsUsersItemApiDto {
    uniq_id: string;
    email: string;
    phone: string;
    first_name: string;
    last_name: string;
}

export type ProfilsHabilitationsUsersResponseApiDto =
    PaginatedResponseDto<ProfilsHabilitationsUsersItemApiDto>;
