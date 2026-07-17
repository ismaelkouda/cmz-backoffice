import { MunicipalitiesQuery } from '@pages/administrative-boundary/application/queries/municipalities/municipalities.query';

export function municipalitiesQueryMapper(command: MunicipalitiesQuery) {
    return {
        search: command.search,
        region: command.region,
        department: command.department,
        startDate: command.startDate,
        endDate: command.endDate,
    };
}
