// import { RolesDto } from '@shared/data/dto/roles.dto';

export interface ParticipantsFilterApiDto {
    search?: string;
    role?: string;
    team_uniq_id?: string;
    status?: string;
}
