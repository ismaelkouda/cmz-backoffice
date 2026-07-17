import { DepartmentsByRegionIdQuery } from '@pages/administrative-boundary/application/queries/regions/departments-by-region-id.query';

export function departmentsByRegionIdQueryMapper(
    command: DepartmentsByRegionIdQuery
) {
    return {
        uniqId: command.uniqId,
        search: command.search,
        municipality: command.municipality,
        status: command.status,
        startDate: command.startDate,
        endDate: command.endDate,
    };
}
