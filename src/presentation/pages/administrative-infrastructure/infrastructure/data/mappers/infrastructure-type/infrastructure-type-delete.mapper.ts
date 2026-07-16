import { InfrastructureTypeDeleteApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-delete-api.dto';
import { InfrastructureTypeDeleteValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-delete.validate-contract';

export function infrastructureTypeDeleteMapper(
    contract: InfrastructureTypeDeleteValidateContract
): InfrastructureTypeDeleteApiDto {
    const prams = {} as InfrastructureTypeDeleteApiDto;
    if (contract.uniqId) {
        prams.uniq_id = contract.uniqId;
    }
    return prams;
}
