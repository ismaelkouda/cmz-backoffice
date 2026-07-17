import { InfrastructureTypeDeleteCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure-type/infrastructure-type-delete.command';
import { InfrastructureTypeDeleteContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-delete.contract';

export function infrastructureTypeDeleteCommandMapper(
    command: InfrastructureTypeDeleteCommand
): InfrastructureTypeDeleteContract {
    return {
        uniqId: command.uniqId,
    };
}
