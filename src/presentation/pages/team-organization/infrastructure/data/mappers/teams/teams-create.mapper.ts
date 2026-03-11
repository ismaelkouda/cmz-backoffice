import { TeamsCreateEntity } from '@pages/team-organization/domain/entities/teams/teams-create.entity';
import { TeamsCreateApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-create-api.dto';

export function TeamsCreateMapper(
    entity: TeamsCreateEntity
): TeamsCreateApiDto {
    const params: TeamsCreateApiDto = {} as TeamsCreateApiDto;

    if (entity.code) {
        params['code'] = entity.code;
    }

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
