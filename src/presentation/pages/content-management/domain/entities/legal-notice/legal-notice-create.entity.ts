import { LegalNoticeCreateVo } from '@presentation/pages/content-management/domain/value-objects/legal-notice/legal-notice-create.vo';

export class LegalNoticeCreateEntity {
    constructor(
        public readonly version: string,
        public readonly content: string
    ) {}

    static fromVo(vo: LegalNoticeCreateVo): LegalNoticeCreateEntity {
        return new LegalNoticeCreateEntity(vo.version, vo.content);
    }
}
