import { DepartmentsQuery } from '@pages/administrative-boundary/application/queries/departments/departments.query';

export function departmentsQueryMapper(command: DepartmentsQuery) {
    return {
        search: command.search,
        region: command.region,
        startDate: command.startDate,
        endDate: command.endDate,
    };
}
