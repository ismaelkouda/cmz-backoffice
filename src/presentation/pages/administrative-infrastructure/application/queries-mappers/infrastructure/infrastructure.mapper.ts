import { InfrastructureQuery } from '@presentation/pages/administrative-infrastructure/application/queries/infrastructure/infrastructure.query';
import { InfrastructureFilterContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-filter.contract';

export function infrastructureQueryMapper(
    query: InfrastructureQuery
): InfrastructureFilterContract {
    return {
        search: query.search,
        type: query.type,
        region: query.region,
        department: query.department,
        municipality: query.municipality,
        startDate: query.startDate,
        endDate: query.endDate,
    };
}
