import { DetailsQuery } from '@pages/report-states/application/queries/details/details.query';

export function detailsQueryMapper(command: DetailsQuery) {
    return {
        uniqId: command.uniqId,
    };
}
