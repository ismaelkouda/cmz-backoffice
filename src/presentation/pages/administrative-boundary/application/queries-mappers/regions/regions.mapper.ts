import { RegionsQuery } from '@pages/administrative-boundary/application/queries/regions/regions.query';

export function regionsQueryMapper(command: RegionsQuery) {
    return {
        search: command.search,
        startDate: command.startDate,
        endDate: command.endDate,
    };
}
