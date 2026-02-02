import { TeamsCreateEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-create.entity';
import { TeamsCreateApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/teams/teams-create-api.dto';

export function TeamsCreateMapper(vo: TeamsCreateEntity): TeamsCreateApiDto {
    const params: TeamsCreateApiDto = {} as TeamsCreateApiDto;

    if (vo.code) {
        params['code'] = vo.code;
    }

    if (vo.name) {
        params['name'] = vo.name;
    }
    if (vo.description) {
        params['description'] = vo.description;
    }

    return params;
}
