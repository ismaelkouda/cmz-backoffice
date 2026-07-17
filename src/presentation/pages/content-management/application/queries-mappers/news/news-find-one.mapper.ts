import { NewsFindOneQuery } from '@pages/content-management/application/queries/news/news-find-one.query';

export function newsFindOneQueryMapper(command: NewsFindOneQuery) {
    return {
        uniqId: command.uniqId,
    };
}
