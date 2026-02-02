import { TeamsFilterEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-filter.entity';
import { TeamsFilterApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/teams/teams-filter-api.dto';

export function teamsFilterMapper(vo: TeamsFilterEntity): TeamsFilterApiDto {
    const params: TeamsFilterApiDto = {} as TeamsFilterApiDto;

    if (vo.search) {
        params.search = vo.search;
    }
    if (vo.member) {
        params.member = vo.member;
    }
    if (vo.isActive !== undefined) {
        params.is_active = vo.isActive;
    }

    return params;
}
