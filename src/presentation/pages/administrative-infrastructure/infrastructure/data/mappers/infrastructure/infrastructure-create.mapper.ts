import { InfrastructureCreateValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-create.validate-contract';
import { InfrastructureCreateApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure/infrastructure-create-api.dto';

export function infrastructureCreateMapper(
    entity: InfrastructureCreateValidateContract
): InfrastructureCreateApiDto {
    const params: InfrastructureCreateApiDto = {} as InfrastructureCreateApiDto;

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
