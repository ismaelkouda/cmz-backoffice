import { InfrastructureTypeDeleteCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure-type/infrastructure-type-delete.command';
import { InfrastructureTypeDeleteDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure-type/infrastructure-type-delete.dto';

export function infrastructureTypeDeleteCommandMapper(
    command: InfrastructureTypeDeleteCommand
): InfrastructureTypeDeleteDto {
    return {
        uniqId: command.uniqId,
    };
}
