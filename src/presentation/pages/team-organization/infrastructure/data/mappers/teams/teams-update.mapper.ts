import { TeamsUpdateEntity } from '@pages/team-organization/domain/entities/teams/teams-update.entity';
import { TeamsUpdateApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-update-api.dto';

export function teamsUpdateMapper(
    entity: TeamsUpdateEntity
): TeamsUpdateApiDto {
    const params: TeamsUpdateApiDto = {} as TeamsUpdateApiDto;

    params['id'] = entity.uniqId;

    // if (entity.code) {
    //     params['code'] = entity.code;
    // }

    if (entity.name) {
        params['name'] = entity.name;
    }
    if (entity.description) {
        params['description'] = entity.description;
    }
    if (entity.operators) {
        params['operators'] = entity.operators;
    }
    if (entity.reportTypes) {
        params['report_types'] = entity.reportTypes;
    }
    if (entity.permissions) {
        params['permissions'] = entity.permissions.map(Number);
    }

    return params;
}
