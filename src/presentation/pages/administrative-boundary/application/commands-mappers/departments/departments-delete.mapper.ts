import { DepartmentsDeleteCommand } from '@pages/administrative-boundary/application/commands/departments/departments-delete.command';

export function departmentsDeleteCommandMapper(
    command: DepartmentsDeleteCommand
) {
    return {
        uniqId: command.uniqId,
    };
}
