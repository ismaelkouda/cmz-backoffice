import { HomeFindOneQuery } from '@pages/content-management/application/queries/home/home-find-one.query';

export function homeFindOneQueryMapper(command: HomeFindOneQuery) {
    return {
        uniqId: command.uniqId,
    };
}
