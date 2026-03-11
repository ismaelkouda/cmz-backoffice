import { PrivacyPolicyPublishVo } from '@pages/content-management/domain/value-objects/privacy-policy/privacy-policy-publish.vo';

export class PrivacyPolicyPublishEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: PrivacyPolicyPublishVo): PrivacyPolicyPublishEntity {
        return new PrivacyPolicyPublishEntity(vo.uniqId);
    }

    appliesToAdminScope(): boolean {
        return this.uniqId === 'ADMIN_ACTION';
    }

    describe(): string {
        return JSON.stringify({
            uniqId: this.uniqId,
        });
    }
}
