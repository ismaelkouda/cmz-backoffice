import { TermsUseCreateVo } from '@pages/content-management/domain/value-objects/terms-use/terms-use-create.vo';

export class TermsUseCreateEntity {
    constructor(
        public readonly version: string,
        public readonly content: string
    ) {}

    static fromVo(vo: TermsUseCreateVo): TermsUseCreateEntity {
        return new TermsUseCreateEntity(vo.version, vo.content);
    }
}
