import { inject, Injectable } from '@angular/core';
import { TeamsParticipantsAssignEntity } from '@pages/team-organization/domain/entities/teams/teams-participants-assign.entity';
import { TeamsParticipantsAssignApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-participants-assign-api.dto';
import { RolesMapper } from '@shared/data/mappers/roles.mapper';

@Injectable({ providedIn: 'root' })
export class TeamsParticipantsAssignMapper {
    private readonly rolesMapper = inject(RolesMapper);
    map(entity: TeamsParticipantsAssignEntity): TeamsParticipantsAssignApiDto {
        return {
            uniq_id: entity.uniqId,
            role: this.rolesMapper.mapToDto(entity.role),
            member_ids: entity.participants,
        };
    }
}
