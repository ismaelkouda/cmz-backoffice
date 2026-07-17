import { InfrastructureTypeUpdateValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-update.validate-contract';
import { InfrastructureTypeUpdateApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-update-api.dto';

export function infrastructureTypeUpdateMapper(
    validContract: InfrastructureTypeUpdateValidateContract
): InfrastructureTypeUpdateApiDto {
    const params: InfrastructureTypeUpdateApiDto =
        {} as InfrastructureTypeUpdateApiDto;

    if (validContract.uniqId) {
        params.id = validContract.uniqId;
    }
    if (validContract.name) {
        params.name = validContract.name;
    }
    if (validContract.description) {
        params.description = validContract.description;
    }

    return params;
}
