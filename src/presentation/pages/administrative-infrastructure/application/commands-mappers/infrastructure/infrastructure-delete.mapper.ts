import { InfrastructureDeleteCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure/infrastructure-delete.command';
import { InfrastructureDeleteContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-delete.contract';

export function infrastructureDeleteCommandMapper(
    command: InfrastructureDeleteCommand
): InfrastructureDeleteContract {
    return {
        uniqId: command.uniqId,
    };
}
