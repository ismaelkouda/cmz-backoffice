import { MunicipalitiesCreateCommand } from '@pages/administrative-boundary/application/commands/municipalities/municipalities-create.command';
import { MunicipalitiesCreateContract } from '@presentation/pages/administrative-boundary/domain/contracts/municipalities/municipalities-create.contract';

export function municipalitiesCreateCommandMapper(
    command: MunicipalitiesCreateCommand
): MunicipalitiesCreateContract {
    return {
        code: command.code,
        population: command.population,
        infrastructure: command.infrastructure,
        name: command.name,
        region: command.region,
        description: command.description,
        department: command?.department,
    };
}
