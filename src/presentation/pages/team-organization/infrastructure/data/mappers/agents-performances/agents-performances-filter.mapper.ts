import { AgentsPerformancesFilterEntity } from '@presentation/pages/team-organization/domain/entities/agents-performances/agents-performances-filter.entity';
import { AgentsPerformancesFilterApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/agents-performances/agents-performances-filter-api.dto';

export function AgentsPerformancesFilterMapper(
    vo: AgentsPerformancesFilterEntity
): AgentsPerformancesFilterApiDto {
    const params: AgentsPerformancesFilterApiDto =
        {} as AgentsPerformancesFilterApiDto;

    if (vo.search) {
        params.search = vo.search;
    }
    if (vo.period?.start) {
        params.start_date = vo.period.start;
    }
    if (vo.period?.end) {
        params.end_date = vo.period.end;
    }

    return params;
}
