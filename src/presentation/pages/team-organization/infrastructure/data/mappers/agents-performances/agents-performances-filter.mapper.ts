import { AgentsPerformancesFilterEntity } from '@pages/team-organization/domain/entities/agents-performances/agents-performances-filter.entity';
import { AgentsPerformancesFilterApiDto } from '@pages/team-organization/infrastructure/api/dto/agents-performances/agents-performances-filter-api.dto';

export function AgentsPerformancesFilterMapper(
    entity: AgentsPerformancesFilterEntity
): AgentsPerformancesFilterApiDto {
    const params: AgentsPerformancesFilterApiDto =
        {} as AgentsPerformancesFilterApiDto;

    if (entity.search) {
        params.search = entity.search;
    }
    if (entity.member) {
        params.member = entity.member;
    }
    if (entity.search) {
        params.search = entity.search;
    }
    if (entity.period?.start) {
        params.start_date = entity.period.start;
    }
    if (entity.period?.end) {
        params.end_date = entity.period.end;
    }

    return params;
}
