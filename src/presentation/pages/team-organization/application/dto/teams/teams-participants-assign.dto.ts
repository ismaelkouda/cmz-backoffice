import { Roles } from '@shared/domain/enums/roles.enum';

export interface TeamsParticipantsAssignDto {
    uniqId: string;
    role: Roles;
    participants: string[];
}
