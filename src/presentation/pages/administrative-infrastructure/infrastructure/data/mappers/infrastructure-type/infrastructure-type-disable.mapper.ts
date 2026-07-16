import { InfrastructureTypeDisableApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-disable-api.dto';
import { InfrastructureTypeDisableValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-disable.validate-contract';

export function infrastructureTypeDisableMapper(
    contract: InfrastructureTypeDisableValidateContract
): InfrastructureTypeDisableApiDto {
    const prams = {} as InfrastructureTypeDisableApiDto;
    if (contract.uniqId) {
        prams.uniq_id = contract.uniqId;
    }
    return prams;
}
