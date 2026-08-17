import { InfrastructureTypeEnableCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure-type/infrastructure-type-enable.command';
import { InfrastructureTypeEnableContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-enable.contract';

export function infrastructureTypeEnableCommandMapper(
    command: InfrastructureTypeEnableCommand
): InfrastructureTypeEnableContract {
    return {
        uniqId: command.uniqId,
    };
}
