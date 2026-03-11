import { PrivacyPolicyCreateVo } from '@pages/content-management/domain/value-objects/privacy-policy/privacy-policy-create.vo';

export class PrivacyPolicyCreateEntity {
    constructor(
        public readonly version: string,
        public readonly content: string
    ) {}

    static fromVo(vo: PrivacyPolicyCreateVo): PrivacyPolicyCreateEntity {
        return new PrivacyPolicyCreateEntity(vo.version, vo.content);
    }
}
