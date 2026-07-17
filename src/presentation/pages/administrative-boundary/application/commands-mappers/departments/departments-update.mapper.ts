import { DepartmentsUpdateCommand } from '@pages/administrative-boundary/application/commands/departments/departments-update.command';
import { DepartmentsUpdateContract } from '@presentation/pages/administrative-boundary/domain/contracts/departments/departments-update.contract';

export function departmentsUpdateCommandMapper(
    command: DepartmentsUpdateCommand
): DepartmentsUpdateContract {
    return {
        uniqId: command.uniqId,
        code: command.code,
        population: command.population,
        infrastructure: command.infrastructure,
        name: command.name,
        region: command.region,
        description: command.description,
    };
}
