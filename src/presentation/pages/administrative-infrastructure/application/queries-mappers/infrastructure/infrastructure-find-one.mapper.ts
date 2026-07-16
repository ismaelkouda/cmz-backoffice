import { InfrastructureFindOneQuery } from '@presentation/pages/administrative-infrastructure/application/queries/infrastructure/infrastructure-find-one.query';
import { InfrastructureFindOneFilterContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-find-one-filter.contract';

export function infrastructureFindOneQueryMapper(
    query: InfrastructureFindOneQuery
): InfrastructureFindOneFilterContract {
    return {
        uniqId: query.uniqId,
    };
}
