import { InfrastructureUpdateCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure/infrastructure-update.command';
import { InfrastructureUpdateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-update.contract';

export function infrastructureUpdateCommandMapper(
    command: InfrastructureUpdateCommand
): InfrastructureUpdateContract {
    return {
        uniqId: command.uniqId,
        name: command.name,
        type: command.type,
        position: command.position,
        description: command.description,
    };
}
