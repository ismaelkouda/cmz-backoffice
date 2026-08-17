import { InfrastructureTypeEnableApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-enable-api.dto';
import { InfrastructureTypeEnableValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-enable.validate-contract';

export function infrastructureTypeEnableMapper(
    validContract: InfrastructureTypeEnableValidateContract
): InfrastructureTypeEnableApiDto {
    const prams = {} as InfrastructureTypeEnableApiDto;
    if (validContract.uniqId) {
        prams.uniq_id = validContract.uniqId;
    }
    return prams;
}
