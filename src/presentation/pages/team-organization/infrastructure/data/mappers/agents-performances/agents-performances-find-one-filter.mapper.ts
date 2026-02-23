import { AgentsPerformancesFindOneFilterEntity } from '@presentation/pages/team-organization/domain/entities/agents-performances/agents-performances-find-one-filter.entity';

import { AgentsPerformancesFindOneFilterApiDto } from '../../../api/dto/agents-performances/agents-performances-find-one-filter-api.dto';

export function agentsPerformancesFindOneFilterMapper(
    entity: AgentsPerformancesFindOneFilterEntity
): AgentsPerformancesFindOneFilterApiDto {
    return {
        uniq_id: entity.uniqId ?? '',
        search: entity.search,
        report_type: entity.reportType,
        operators: entity.operators ?? [],
        start_date: entity.period?.start,
        end_date: entity.period?.end,
    };
}
