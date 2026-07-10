import { InfrastructureCreateEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-create.entity';
import { InfrastructureCreateApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure/infrastructure-create-api.dto';

export function infrastructureCreateMapper(
    entity: InfrastructureCreateEntity
): InfrastructureCreateApiDto {
    const params: InfrastructureCreateApiDto = {} as InfrastructureCreateApiDto;

    if (entity.name) {
        params.name = entity.name;
    }
    if (entity.description) {
        params.description = entity.description;
    }

    return params;
}
