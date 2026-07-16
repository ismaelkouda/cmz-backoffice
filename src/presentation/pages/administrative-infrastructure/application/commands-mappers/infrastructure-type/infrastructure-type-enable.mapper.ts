import { InfrastructureTypeEnableCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure-type/infrastructure-type-enable.command';
import { InfrastructureTypeEnableDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure-type/infrastructure-type-enable.dto';

export function infrastructureTypeEnableCommandMapper(
    command: InfrastructureTypeEnableCommand
): InfrastructureTypeEnableDto {
    return {
        uniqId: command.uniqId,
    };
}
