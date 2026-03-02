import { PrivacyPolicyUnpublishVo } from '@presentation/pages/content-management/domain/value-objects/privacy-policy/privacy-policy-unpublish.vo';

export class PrivacyPolicyUnpublishEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: PrivacyPolicyUnpublishVo): PrivacyPolicyUnpublishEntity {
        return new PrivacyPolicyUnpublishEntity(vo.uniqId);
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
