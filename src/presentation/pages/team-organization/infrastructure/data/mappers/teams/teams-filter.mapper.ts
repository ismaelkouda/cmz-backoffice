import { TeamsFilterEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-filter.entity';
import { TeamsFilterApiDto } from '@presentation/pages/team-organization/infrastructure/api/dto/teams/teams-filter-api.dto';

export function teamsFilterMapper(
    entity: TeamsFilterEntity
): TeamsFilterApiDto {
    const params: TeamsFilterApiDto = {} as TeamsFilterApiDto;

    if (entity.search) {
        params.search = entity.search;
    }
    if (entity.member) {
        params.member = entity.member;
    }
    if (entity.isActive !== undefined) {
        params.is_active = !!entity.isActive;
    }

    return params;
}
