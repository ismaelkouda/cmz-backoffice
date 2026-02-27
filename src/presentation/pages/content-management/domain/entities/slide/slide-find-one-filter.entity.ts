import { SlideFindOneFilterVo } from '@presentation/pages/content-management/domain/value-objects/slide/slide-find-one-filter.vo';

export class SlideFindOneFilterEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: SlideFindOneFilterVo): SlideFindOneFilterEntity {
        return new SlideFindOneFilterEntity(vo.uniqId);
    }
}
