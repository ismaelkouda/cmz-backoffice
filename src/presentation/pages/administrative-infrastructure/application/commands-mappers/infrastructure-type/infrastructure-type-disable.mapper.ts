import { InfrastructureTypeDisableCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure-type/infrastructure-type-disable.command';
import { InfrastructureTypeDisableDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure-type/infrastructure-type-disable.dto';

export function infrastructureTypeDisableCommandMapper(
    command: InfrastructureTypeDisableCommand
): InfrastructureTypeDisableDto {
    return {
        uniqId: command.uniqId,
    };
}
