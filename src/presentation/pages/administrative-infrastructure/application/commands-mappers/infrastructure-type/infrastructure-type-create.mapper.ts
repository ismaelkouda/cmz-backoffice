import { InfrastructureTypeCreateCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure-type/infrastructure-type-create.command';
import { InfrastructureTypeCreateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-create.contract';

export function infrastructureTypeCreateCommandMapper(
    command: InfrastructureTypeCreateCommand
): InfrastructureTypeCreateContract {
    return {
        name: command.name,
        description: command.description,
    };
}
