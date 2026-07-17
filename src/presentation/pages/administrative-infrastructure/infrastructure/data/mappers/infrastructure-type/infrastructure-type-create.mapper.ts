import { InfrastructureTypeCreateValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-create.validate-contract';
import { InfrastructureTypeCreateApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-create-api.dto';

export function infrastructureTypeCreateMapper(
    validContract: InfrastructureTypeCreateValidateContract
): InfrastructureTypeCreateApiDto {
    const params: InfrastructureTypeCreateApiDto =
        {} as InfrastructureTypeCreateApiDto;

    if (validContract.name) {
        params.name = validContract.name;
    }
    if (validContract.description) {
        params.description = validContract.description;
    }

    return params;
}
