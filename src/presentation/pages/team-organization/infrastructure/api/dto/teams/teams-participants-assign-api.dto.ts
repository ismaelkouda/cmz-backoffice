import { RolesDto } from '@shared/data/dto/roles.dto';

export interface TeamsParticipantsAssignApiDto {
    uniq_id: string;
    role: RolesDto;
    member_ids: string[];
}
