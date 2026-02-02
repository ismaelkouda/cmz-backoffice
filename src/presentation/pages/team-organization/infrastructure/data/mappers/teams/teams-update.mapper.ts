import { TeamsUpdateEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-update.entity';
import { TeamsUpdateApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/teams/teams-update-api.dto';

export function teamsUpdateMapper(
    entity: TeamsUpdateEntity
): TeamsUpdateApiDto {
    const params: TeamsUpdateApiDto = {} as TeamsUpdateApiDto;

    params['id'] = entity.uniqId;

    if (entity.code) {
        params['code'] = entity.code;
    }

    if (entity.name) {
        params['name'] = entity.name;
    }
    if (entity.description) {
        params['description'] = entity.description;
    }

    return params;
}
