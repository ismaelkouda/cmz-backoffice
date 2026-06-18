import { Roles } from '@shared/domain/enums/roles.enum';

export interface ParticipantsFilterDto {
    search?: string;
    role?: Roles;
    team?: string;
    status?: string;
}
