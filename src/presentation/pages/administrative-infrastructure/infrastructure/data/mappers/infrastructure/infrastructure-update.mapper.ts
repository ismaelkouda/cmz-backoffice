import { InfrastructureUpdateValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-update.validate-contract';
import { InfrastructureUpdateApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure/infrastructure-update-api.dto';

export function infrastructureUpdateMapper(
    entity: InfrastructureUpdateValidateContract
): InfrastructureUpdateApiDto {
    const params: InfrastructureUpdateApiDto = {} as InfrastructureUpdateApiDto;

    if (entity.uniqId) {
        params.id = entity.uniqId;
    }
    if (entity.name) {
        params.name = entity.name;
    }
    if (entity.type) {
        params.infrastructure_type = entity.type;
    }
    if (entity.position) {
        params.latitude = entity.position.latitude;
        params.longitude = entity.position.longitude;
    }
    if (entity.description) {
        params.description = entity.description;
    }

    return params;
}
