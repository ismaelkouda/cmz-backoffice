import { InfrastructureTypeQuery } from '@presentation/pages/administrative-infrastructure/application/queries/infrastructure-type/infrastructure-type.query';
import { InfrastructureTypeFilterContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-filter.contract';

export function infrastructureTypeQueryMapper(
    query: InfrastructureTypeQuery
): InfrastructureTypeFilterContract {
    return {
        search: query.search,
        status: query.status,
        startDate: query.startDate,
        endDate: query.endDate,
    };
}
