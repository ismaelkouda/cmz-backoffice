import { DepartmentsCreateCommand } from '@pages/administrative-boundary/application/commands/departments/departments-create.command';
import { DepartmentsCreateContract } from '@presentation/pages/administrative-boundary/domain/contracts/departments/departments-create.contract';

export function departmentsCreateCommandMapper(
    command: DepartmentsCreateCommand
): DepartmentsCreateContract {
    return {
        code: command.code,
        population: command.population,
        infrastructure: command.infrastructure,
        name: command.name,
        region: command.region,
        description: command.description,
    };
}
