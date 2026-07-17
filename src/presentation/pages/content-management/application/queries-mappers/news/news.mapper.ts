import { NewsQuery } from '@pages/content-management/application/queries/news/news.query';

export function newsQueryMapper(command: NewsQuery) {
    return {
        search: command.search,
        status: command.status,
        startDate: command.startDate,
        endDate: command.endDate,
    };
}
