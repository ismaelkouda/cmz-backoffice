import { InfrastructureDeleteCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure/infrastructure-delete.command';
import { InfrastructureDeleteDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure/infrastructure-delete.dto';

export function infrastructureDeleteCommandMapper(
    command: InfrastructureDeleteCommand
): InfrastructureDeleteDto {
    return {
        uniqId: command.uniqId,
    };
}
