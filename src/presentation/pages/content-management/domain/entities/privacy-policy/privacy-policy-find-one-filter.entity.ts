import { PrivacyPolicyFindOneFilterVo } from '@presentation/pages/content-management/domain/value-objects/privacy-policy/privacy-policy-find-one-filter.vo';

export class PrivacyPolicyFindOneFilterEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(
        vo: PrivacyPolicyFindOneFilterVo
    ): PrivacyPolicyFindOneFilterEntity {
        return new PrivacyPolicyFindOneFilterEntity(vo.uniqId);
    }
}
