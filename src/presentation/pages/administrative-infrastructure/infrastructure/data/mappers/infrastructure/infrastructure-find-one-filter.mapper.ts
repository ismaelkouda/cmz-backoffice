import { InfrastructureFindOneFilterApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure/infrastructure-find-one-filter-api.dto';
import { InfrastructureFindOneFilterValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-find-one-filter.validate-contract';

export function infrastructureFindOneFilterMapper(
    contract: InfrastructureFindOneFilterValidateContract
): InfrastructureFindOneFilterApiDto {
    const params: InfrastructureFindOneFilterApiDto =
        {} as InfrastructureFindOneFilterApiDto;

    if (contract.uniqId) {
        params.id = contract.uniqId;
    }

    return params;
}
