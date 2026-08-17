import { InfrastructureUpdateValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-update.validate-contract';
import { InfrastructureUpdateApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure/infrastructure-update-api.dto';

export function infrastructureUpdateMapper(
    validContract: InfrastructureUpdateValidateContract
): InfrastructureUpdateApiDto {
    const params: InfrastructureUpdateApiDto = {} as InfrastructureUpdateApiDto;

    if (validContract.uniqId) {
        params.id = validContract.uniqId;
    }
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
