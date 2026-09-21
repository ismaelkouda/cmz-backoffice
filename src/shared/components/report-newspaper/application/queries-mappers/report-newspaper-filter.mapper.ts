import { ReportNewspaperFilterQuery } from '@shared/components/report-newspaper/application/queries/report-newspaper-filter.query';

export function reportNewspaperFilterQueryMapper(
    command: ReportNewspaperFilterQuery
) {
    return {
        uniqId: command.uniqId,
    };
}
