import { MunicipalitiesByDepartmentIdQuery } from '@pages/administrative-boundary/application/queries/departments/municipalities-by-department-id.query';

export function municipalitiesByDepartmentIdQueryMapper(
    command: MunicipalitiesByDepartmentIdQuery
) {
    return {
        uniqId: command.uniqId,
        search: command.search,
        region: command.region,
        department: command.department,
        status: command.status,
        startDate: command.startDate,
        endDate: command.endDate,
    };
}
