import { PrivacyPolicyFilterVo } from '@presentation/pages/content-management/domain/value-objects/privacy-policy/privacy-policy-filter.vo';

export class PrivacyPolicyFilterEntity {
    constructor(
        public readonly search?: string,
        public readonly version?: string,
        public readonly status?: string,
        public readonly startDate?: string,
        public readonly endDate?: string
    ) {}

    static fromVo(vo: PrivacyPolicyFilterVo): PrivacyPolicyFilterEntity {
        return new PrivacyPolicyFilterEntity(
            vo.search,
            vo.version,
            vo.status,
            vo.startDate,
            vo.endDate
        );
    }
}
