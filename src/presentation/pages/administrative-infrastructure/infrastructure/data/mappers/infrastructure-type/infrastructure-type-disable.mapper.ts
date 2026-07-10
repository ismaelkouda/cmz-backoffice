import { InfrastructureTypeDisableEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-disable.entity';
import { InfrastructureTypeDisableApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-disable-api.dto';

export function infrastructureTypeDisableMapper(
    vo: InfrastructureTypeDisableEntity
): InfrastructureTypeDisableApiDto {
    const prams = {} as InfrastructureTypeDisableApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
