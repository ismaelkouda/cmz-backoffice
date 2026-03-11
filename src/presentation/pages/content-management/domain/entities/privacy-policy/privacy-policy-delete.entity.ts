import { PrivacyPolicyDeleteVo } from '@pages/content-management/domain/value-objects/privacy-policy/privacy-policy-delete.vo';

export class PrivacyPolicyDeleteEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: PrivacyPolicyDeleteVo): PrivacyPolicyDeleteEntity {
        return new PrivacyPolicyDeleteEntity(vo.uniqId);
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
