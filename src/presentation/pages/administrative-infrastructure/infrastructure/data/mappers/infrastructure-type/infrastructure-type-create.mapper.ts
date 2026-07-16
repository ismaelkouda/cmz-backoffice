import { InfrastructureTypeCreateValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-create.validate-contract';
import { InfrastructureTypeCreateApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-create-api.dto';

export function infrastructureTypeCreateMapper(
    contract: InfrastructureTypeCreateValidateContract
): InfrastructureTypeCreateApiDto {
    const params: InfrastructureTypeCreateApiDto =
        {} as InfrastructureTypeCreateApiDto;

    if (contract.name) {
        params.name = contract.name;
    }
    if (contract.description) {
        params.description = contract.description;
    }

    return params;
}
