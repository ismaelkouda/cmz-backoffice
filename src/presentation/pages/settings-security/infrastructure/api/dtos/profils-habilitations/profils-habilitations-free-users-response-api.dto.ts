import { PaginatedResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface ProfilsHabilitationsFreeUsersItemApiDto {
    uniq_id: string;
    email: string;
    phone: string;
    first_name: string;
    last_name: string;
}

export type ProfilsHabilitationsFreeUsersResponseApiDto =
    PaginatedResponseDto<ProfilsHabilitationsFreeUsersItemApiDto>;
