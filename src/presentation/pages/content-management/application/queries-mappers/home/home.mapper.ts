import { HomeQuery } from '@pages/content-management/application/queries/home/home.query';

export function homeQueryMapper(command: HomeQuery) {
    return {
        search: command.search,
        platforms: command.platforms,
        status: command.status,
        startDate: command.startDate,
        endDate: command.endDate,
    };
}
