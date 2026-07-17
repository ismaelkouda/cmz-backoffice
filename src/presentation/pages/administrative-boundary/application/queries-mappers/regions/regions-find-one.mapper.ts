import { RegionsFindOneQuery } from '@pages/administrative-boundary/application/queries/regions/regions-find-one.query';

export function regionsFindOneQueryMapper(command: RegionsFindOneQuery) {
    return {
        uniqId: command.uniqId,
    };
}
