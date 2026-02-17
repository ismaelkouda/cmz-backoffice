import { TeamsFindOneFilterEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-find-one-filter.entity';
import { TeamsFindOneFilterApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/teams/teams-find-one-filter-api.dto';

export function teamsFindOneFilterMapper(
    entity: TeamsFindOneFilterEntity
): TeamsFindOneFilterApiDto {
    return {
        id: entity.uniqId,
    };
}
