import { InfrastructureDeleteApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure/infrastructure-delete-api.dto';
import { InfrastructureDeleteValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-delete.validate-contract';

export function infrastructureDeleteMapper(
    contract: InfrastructureDeleteValidateContract
): InfrastructureDeleteApiDto {
    const prams = {} as InfrastructureDeleteApiDto;
    if (contract.uniqId) {
        prams.uniq_id = contract.uniqId;
    }
    return prams;
}
