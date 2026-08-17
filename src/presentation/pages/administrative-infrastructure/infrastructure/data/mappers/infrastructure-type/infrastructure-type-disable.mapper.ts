import { InfrastructureTypeDisableApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-disable-api.dto';
import { InfrastructureTypeDisableValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-disable.validate-contract';

export function infrastructureTypeDisableMapper(
    validContract: InfrastructureTypeDisableValidateContract
): InfrastructureTypeDisableApiDto {
    const prams = {} as InfrastructureTypeDisableApiDto;
    if (validContract.uniqId) {
        prams.uniq_id = validContract.uniqId;
    }
    return prams;
}
