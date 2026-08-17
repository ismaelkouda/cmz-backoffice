import { RegionsUpdateCommand } from '@pages/administrative-boundary/application/commands/regions/regions-update.command';
import { RegionsUpdateContract } from '@presentation/pages/administrative-boundary/domain/contracts/regions/regions-update.contract';

export function regionsUpdateCommandMapper(
    command: RegionsUpdateCommand
): RegionsUpdateContract {
    return {
        uniqId: command.uniqId,
        code: command.code,
        population: command.population,
        infrastructure: command.infrastructure,
        name: command.name,
        description: command.description,
    };
}
