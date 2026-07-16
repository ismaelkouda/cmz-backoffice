import { InfrastructureTypeEnableApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-enable-api.dto';
import { InfrastructureTypeEnableValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-enable.validate-contract';

export function infrastructureTypeEnableMapper(
    contract: InfrastructureTypeEnableValidateContract
): InfrastructureTypeEnableApiDto {
    const prams = {} as InfrastructureTypeEnableApiDto;
    if (contract.uniqId) {
        prams.uniq_id = contract.uniqId;
    }
    return prams;
}
