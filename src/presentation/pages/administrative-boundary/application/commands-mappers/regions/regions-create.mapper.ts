import { RegionsCreateCommand } from '@pages/administrative-boundary/application/commands/regions/regions-create.command';
import { RegionsCreateContract } from '@presentation/pages/administrative-boundary/domain/contracts/regions/regions-create.contract';

export function regionsCreateCommandMapper(
    command: RegionsCreateCommand
): RegionsCreateContract {
    return {
        code: command.code,
        population: command.population,
        infrastructure: command.infrastructure,
        name: command.name,
        description: command.description,
    };
}
