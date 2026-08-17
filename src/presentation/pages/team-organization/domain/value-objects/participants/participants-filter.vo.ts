import { ParticipantsFilterDto } from '@pages/team-organization/application/dto/participants/participants-filter.dto';
import { Roles } from '@shared/domain/enums/roles.enum';

export interface ParticipantsFilterVo {
    search?: string;
    role?: Roles;
    team?: string;
    status?: string;
}

export function participantsFilterVo(
    dto: ParticipantsFilterDto | null = {} as ParticipantsFilterDto
): ParticipantsFilterVo {
    return {
        search: dto?.search?.trim() || undefined,
        role: dto?.role,
        team: dto?.team,
        status: dto?.status,
    };
}
