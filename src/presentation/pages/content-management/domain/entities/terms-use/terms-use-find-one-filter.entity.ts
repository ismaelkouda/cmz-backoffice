import { TermsUseFindOneFilterVo } from '@pages/content-management/domain/value-objects/terms-use/terms-use-find-one-filter.vo';

export class TermsUseFindOneFilterEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: TermsUseFindOneFilterVo): TermsUseFindOneFilterEntity {
        return new TermsUseFindOneFilterEntity(vo.uniqId);
    }
}
