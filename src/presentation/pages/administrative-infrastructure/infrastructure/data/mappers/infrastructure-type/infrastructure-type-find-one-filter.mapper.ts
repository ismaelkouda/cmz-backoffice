import { InfrastructureTypeFindOneFilterApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-find-one-filter-api.dto';
import { InfrastructureTypeFindOneFilterValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-find-one-filter.validate-contract';

export function infrastructureTypeFindOneFilterMapper(
    contract: InfrastructureTypeFindOneFilterValidateContract
): InfrastructureTypeFindOneFilterApiDto {
    const params: InfrastructureTypeFindOneFilterApiDto =
        {} as InfrastructureTypeFindOneFilterApiDto;

    if (contract.uniqId) {
        params.id = contract.uniqId;
    }

    return params;
}
