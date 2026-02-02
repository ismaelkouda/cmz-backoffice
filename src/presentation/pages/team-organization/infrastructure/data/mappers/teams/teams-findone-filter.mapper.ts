import { TeamsFindOneFilterEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-findone-filter.entity';
import { TeamsFindOneFilterApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/teams/teams-findone-filter-api.dto';

export function teamsFindOneFilterMapper(entity: TeamsFindOneFilterEntity): TeamsFindOneFilterApiDto {
    return {
        id: entity.uniqId,
    };
}
