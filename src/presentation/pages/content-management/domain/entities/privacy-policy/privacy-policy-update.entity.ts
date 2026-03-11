import { PrivacyPolicyUpdateVo } from '@pages/content-management/domain/value-objects/privacy-policy/privacy-policy-update.vo';

export class PrivacyPolicyUpdateEntity {
    constructor(
        public readonly uniqId: string,
        public readonly version: string,
        public readonly content: string
    ) {}
    static fromVo(vo: PrivacyPolicyUpdateVo): PrivacyPolicyUpdateEntity {
        return new PrivacyPolicyUpdateEntity(vo.uniqId, vo.version, vo.content);
    }
}
