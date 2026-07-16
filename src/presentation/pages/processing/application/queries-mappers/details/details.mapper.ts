import { DetailsQuery } from '@pages/processing/application/queries/details/details.query';

export function detailsQueryMapper(command: DetailsQuery) {
    return {
        uniqId: command.uniqId,
    };
}
