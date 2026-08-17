import { SlideFindOneQuery } from '@pages/content-management/application/queries/slide/slide-find-one.query';

export function slideFindOneQueryMapper(command: SlideFindOneQuery) {
    return {
        uniqId: command.uniqId,
    };
}
