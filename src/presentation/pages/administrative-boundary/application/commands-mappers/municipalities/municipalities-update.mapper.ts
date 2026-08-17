import { MunicipalitiesUpdateCommand } from '@pages/administrative-boundary/application/commands/municipalities/municipalities-update.command';
import { MunicipalitiesUpdateContract } from '@presentation/pages/administrative-boundary/domain/contracts/municipalities/municipalities-update.contract';

export function municipalitiesUpdateCommandMapper(
    command: MunicipalitiesUpdateCommand
): MunicipalitiesUpdateContract {
    return {
        uniqId: command.uniqId,
        code: command.code,
        population: command.population,
        infrastructure: command.infrastructure,
        name: command.name,
        region: command.region,
        description: command.description,
        department: command?.department,
    };
}
