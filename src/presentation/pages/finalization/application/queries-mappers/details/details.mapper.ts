import { DetailsQuery } from '@pages/finalization/application/queries/details/details.query';

export function detailsQueryMapper(command: DetailsQuery) {
    return {
        uniqId: command.uniqId,
    };
}
