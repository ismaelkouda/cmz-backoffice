import { inject, Injectable } from '@angular/core';
import { ParticipantsFilterEntity } from '@pages/team-organization/domain/entities/participants/participants-filter.entity';
import { ParticipantsFilterApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-filter-api.dto';
import { RolesMapper } from '@shared/data/mappers/roles.mapper';

@Injectable({
    providedIn: 'root',
})
export class ParticipantsFilterMapper {
    private readonly rolesMapper = inject(RolesMapper);
    mapEntityToApi(entity: ParticipantsFilterEntity): ParticipantsFilterApiDto {
        const params: ParticipantsFilterApiDto = {} as ParticipantsFilterApiDto;

        if (entity.search) {
            params.search = entity.search;
        }
        if (entity.role) {
            params.role = this.rolesMapper.mapToDto(entity.role);
        }
        if (entity.team) {
            params.team_uniq_id = entity.team;
        }
        if (entity.status) {
            params.status = entity.status;
        }

        return params;
    }
}
