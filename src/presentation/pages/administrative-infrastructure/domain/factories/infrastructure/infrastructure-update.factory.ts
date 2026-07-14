import { InfrastructureUpdateValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-update.validate-contract';
import { InfrastructureUpdateEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-update.entity';

export function infrastructureUpdateFactory(
    contract: InfrastructureUpdateValidateContract
): InfrastructureUpdateEntity {
    return new InfrastructureUpdateEntity(contract);
}
