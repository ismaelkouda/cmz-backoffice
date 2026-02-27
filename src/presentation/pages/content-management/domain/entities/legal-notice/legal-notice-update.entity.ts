import { LegalNoticeUpdateVo } from '@presentation/pages/content-management/domain/value-objects/legal-notice/legal-notice-update.vo';

export class LegalNoticeUpdateEntity {
    constructor(
        public readonly uniqId: string,
        public readonly version: string,
        public readonly content: string
    ) {}
    static fromVo(vo: LegalNoticeUpdateVo): LegalNoticeUpdateEntity {
        return new LegalNoticeUpdateEntity(vo.uniqId, vo.version, vo.content);
    }
}
