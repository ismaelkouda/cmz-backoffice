import { HomeFindOneFilterVo } from '@pages/content-management/domain/value-objects/home/home-find-one-filter.vo';

export class HomeFindOneFilterEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: HomeFindOneFilterVo): HomeFindOneFilterEntity {
        return new HomeFindOneFilterEntity(vo.uniqId);
    }
}
