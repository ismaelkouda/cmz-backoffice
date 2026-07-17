import { InfrastructureCreateValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-create.validate-contract';
import { InfrastructureCreateApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure/infrastructure-create-api.dto';

export function infrastructureCreateMapper(
    validContract: InfrastructureCreateValidateContract
): InfrastructureCreateApiDto {
    const params: InfrastructureCreateApiDto = {} as InfrastructureCreateApiDto;

    if (validContract.name) {
        params.name = validContract.name;
    }
    if (validContract.type) {
        params.infrastructure_type = validContract.type;
    }
    if (validContract.position) {
        params.latitude = validContract.position.latitude;
        params.longitude = validContract.position.longitude;
    }
    if (validContract.description) {
        params.description = validContract.description;
    }

    return params;
}
