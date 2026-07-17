import { InfrastructureTypeFindOneQuery } from '@presentation/pages/administrative-infrastructure/application/queries/infrastructure-type/infrastructure-type-find-one.query';
import { InfrastructureTypeFindOneFilterContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-find-one-filter.contract';

export function infrastructureTypeFindOneQueryMapper(
    query: InfrastructureTypeFindOneQuery
): InfrastructureTypeFindOneFilterContract {
    return {
        uniqId: query.uniqId,
    };
}
