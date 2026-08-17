import { inject, Injectable } from '@angular/core';
import { ParticipantsFilterVo } from '@pages/team-organization/domain/value-objects/participants/participants-filter.vo';
import { ParticipantsFilterApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-filter-api.dto';
import { RolesMapper } from '@shared/data/mappers/roles.mapper';

@Injectable({
    providedIn: 'root',
})
export class ParticipantsFilterMapper {
    private readonly rolesMapper = inject(RolesMapper);
    mapEntityToApi(vo: ParticipantsFilterVo): ParticipantsFilterApiDto {
        const params: ParticipantsFilterApiDto = {} as ParticipantsFilterApiDto;

        if (vo.search) {
            params.search = vo.search;
        }
        if (vo.role) {
            params.role = this.rolesMapper.mapToDto(vo.role);
        }
        if (vo.team) {
            params.team_uniq_id = vo.team;
        }
        if (vo.status) {
            params.status = vo.status;
        }

        return params;
    }
}
