import { InfrastructureCreateEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-create.entity';
import { InfrastructureCreateApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure/infrastructure-create-api.dto';

export function infrastructureCreateMapper(
    entity: InfrastructureCreateEntity
): InfrastructureCreateApiDto {
    const params: InfrastructureCreateApiDto = {} as InfrastructureCreateApiDto;

    if (entity.data.name) {
        params.name = entity.data.name;
    }
    if (entity.data.type) {
        params.infrastructure_type = entity.data.type;
    }
    if (entity.data.position) {
        params.latitude = entity.data.position.latitude;
        params.longitude = entity.data.position.longitude;
    }
    if (entity.data.description) {
        params.description = entity.data.description;
    }

    return params;
}
