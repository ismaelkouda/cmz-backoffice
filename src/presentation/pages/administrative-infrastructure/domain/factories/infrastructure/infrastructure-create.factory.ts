import { InfrastructureCreateValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-create.validate-contract';
import { InfrastructureCreateEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-create.entity';

export function infrastructureCreateFactory(
    contract: InfrastructureCreateValidateContract
): InfrastructureCreateEntity {
    return new InfrastructureCreateEntity(contract);
}
