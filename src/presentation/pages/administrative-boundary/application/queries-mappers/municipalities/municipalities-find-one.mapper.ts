import { MunicipalitiesFindOneQuery } from '@pages/administrative-boundary/application/queries/municipalities/municipalities-find-one.query';

export function municipalitiesFindOneQueryMapper(
    command: MunicipalitiesFindOneQuery
) {
    return {
        uniqId: command.uniqId,
    };
}
