import { InfrastructureCreateCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure/infrastructure-create.command';
import { InfrastructureCreateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-create.contract';

export function infrastructureCreateCommandMapper(
    command: InfrastructureCreateCommand
): InfrastructureCreateContract {
    return {
        name: command.name,
        type: command.type,
        position: command.position,
        description: command.description,
    };
}
