import { NewsFindOneFilterVo } from '@presentation/pages/content-management/domain/value-objects/news/news-find-one-filter.vo';

export class NewsFindOneFilterEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: NewsFindOneFilterVo): NewsFindOneFilterEntity {
        return new NewsFindOneFilterEntity(vo.uniqId);
    }
}
