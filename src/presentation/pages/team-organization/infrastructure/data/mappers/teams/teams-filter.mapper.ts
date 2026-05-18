import { inject, Injectable } from '@angular/core';
import { TeamsFilterEntity } from '@pages/team-organization/domain/entities/teams/teams-filter.entity';
import { TeamsFilterApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-filter-api.dto';
import { StatusMapper } from '@pages/team-organization/infrastructure/data/mappers/teams/teams-status.mapper';

@Injectable({
    providedIn: 'root',
})
export class TeamsFilterMapper {
    private readonly statusMapper = inject(StatusMapper);
    map(vo: TeamsFilterEntity): TeamsFilterApiDto {
        const params: TeamsFilterApiDto = {};

        if (vo.search) {
            params.search = vo.search;
        }
        if (vo.member) {
            params.member = vo.member;
        }
        if (vo.status) {
            params.is_active = this.statusMapper.mapStatusToApi(vo.status);
        }

        return params;
    }
}
