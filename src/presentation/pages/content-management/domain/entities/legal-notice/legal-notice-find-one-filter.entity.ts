import { LegalNoticeFindOneFilterVo } from '@presentation/pages/content-management/domain/value-objects/legal-notice/legal-notice-find-one-filter.vo';

export class LegalNoticeFindOneFilterEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(
        vo: LegalNoticeFindOneFilterVo
    ): LegalNoticeFindOneFilterEntity {
        return new LegalNoticeFindOneFilterEntity(vo.uniqId);
    }
}
