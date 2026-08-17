import { InfrastructureFindOneFilterApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure/infrastructure-find-one-filter-api.dto';
import { InfrastructureFindOneFilterValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-find-one-filter.validate-contract';

export function infrastructureFindOneFilterMapper(
    validContract: InfrastructureFindOneFilterValidateContract
): InfrastructureFindOneFilterApiDto {
    const params: InfrastructureFindOneFilterApiDto =
        {} as InfrastructureFindOneFilterApiDto;

    if (validContract.uniqId) {
        params.id = validContract.uniqId;
    }

    return params;
}
