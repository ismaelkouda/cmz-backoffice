import { SlideQuery } from '@pages/content-management/application/queries/slide/slide.query';

export function slideQueryMapper(command: SlideQuery) {
    return {
        search: command.search,
        platforms: command.platforms,
        status: command.status,
        startDate: command.startDate,
        endDate: command.endDate,
    };
}
