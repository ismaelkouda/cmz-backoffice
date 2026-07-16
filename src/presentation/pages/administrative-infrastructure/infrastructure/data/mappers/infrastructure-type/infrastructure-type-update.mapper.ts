import { InfrastructureTypeUpdateValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-update.validate-contract';
import { InfrastructureTypeUpdateApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-update-api.dto';

export function infrastructureTypeUpdateMapper(
    contract: InfrastructureTypeUpdateValidateContract
): InfrastructureTypeUpdateApiDto {
    const params: InfrastructureTypeUpdateApiDto =
        {} as InfrastructureTypeUpdateApiDto;

    if (contract.uniqId) {
        params.id = contract.uniqId;
    }
    if (contract.name) {
        params.name = contract.name;
    }
    if (contract.description) {
        params.description = contract.description;
    }

    return params;
}
