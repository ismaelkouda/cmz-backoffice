import { InfrastructureTypeDisableCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure-type/infrastructure-type-disable.command';
import { InfrastructureTypeDisableContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-disable.contract';

export function infrastructureTypeDisableCommandMapper(
    command: InfrastructureTypeDisableCommand
): InfrastructureTypeDisableContract {
    return {
        uniqId: command.uniqId,
    };
}
