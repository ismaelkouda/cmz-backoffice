import { InfrastructureTypeFilterApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-filter-api.dto';
import { InfrastructureTypeFilterContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-filter.contract';

export function infrastructureTypeFilterMapper(
    contract: InfrastructureTypeFilterContract
): InfrastructureTypeFilterApiDto {
    const params: InfrastructureTypeFilterApiDto =
        {} as InfrastructureTypeFilterApiDto;

    if (contract.search) {
        params.search = contract.search;
    }
    if (contract.status !== undefined) {
        params.is_active = !!contract.status;
    }

    return params;
}
