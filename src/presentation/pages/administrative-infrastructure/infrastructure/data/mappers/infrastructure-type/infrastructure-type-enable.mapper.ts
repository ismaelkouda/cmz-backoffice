import { InfrastructureTypeEnableEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-enable.entity';
import { InfrastructureTypeEnableApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-enable-api.dto';

export function infrastructureTypeEnableMapper(
    vo: InfrastructureTypeEnableEntity
): InfrastructureTypeEnableApiDto {
    const prams = {} as InfrastructureTypeEnableApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
