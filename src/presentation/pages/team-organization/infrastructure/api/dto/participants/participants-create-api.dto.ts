import { RolesDto } from '@shared/data/dto/roles.dto';

export interface ParticipantsCreateApiDto {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    role?: RolesDto;
    team_uniq_id?: string;
}
