import { TermsUseUpdateVo } from '@pages/content-management/domain/value-objects/terms-use/terms-use-update.vo';

export class TermsUseUpdateEntity {
    constructor(
        public readonly uniqId: string,
        public readonly version: string,
        public readonly content: string
    ) {}
    static fromVo(vo: TermsUseUpdateVo): TermsUseUpdateEntity {
        return new TermsUseUpdateEntity(vo.uniqId, vo.version, vo.content);
    }
}
