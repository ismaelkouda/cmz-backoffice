import { inject, Injectable } from '@angular/core';
import { TeamsParticipantsAssignEntity } from '@pages/team-organization/domain/entities/teams/teams-participants-assign.entity';
import { TeamsParticipantsAssignApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-participants-assign-api.dto';
import { RolesMapper } from '@shared/data/mappers/roles.mapper';

@Injectable({ providedIn: 'root' })
export class TeamsParticipantsAssignMapper {
    private readonly rolesMapper = inject(RolesMapper);
    map(vo: TeamsParticipantsAssignEntity): TeamsParticipantsAssignApiDto {
        return {
            uniq_id: vo.uniqId,
            role: this.rolesMapper.mapToDto(vo.roles),
            member_ids: vo.participants,
        };
    }
}
