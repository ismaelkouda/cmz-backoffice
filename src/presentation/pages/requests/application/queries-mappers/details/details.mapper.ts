import { DetailsQuery } from '@pages/requests/application/queries/details/details.query';

export function detailsQueryMapper(command: DetailsQuery) {
    return {
        uniqId: command.uniqId,
    };
}
