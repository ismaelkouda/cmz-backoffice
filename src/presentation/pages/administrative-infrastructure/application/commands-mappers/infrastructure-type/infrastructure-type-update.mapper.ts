import { InfrastructureTypeUpdateCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure-type/infrastructure-type-update.command';
import { InfrastructureTypeUpdateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-update.contract';

export function infrastructureTypeUpdateCommandMapper(
    command: InfrastructureTypeUpdateCommand
): InfrastructureTypeUpdateContract {
    return {
        uniqId: command.uniqId,
        name: command.name,
        description: command.description,
    };
}
