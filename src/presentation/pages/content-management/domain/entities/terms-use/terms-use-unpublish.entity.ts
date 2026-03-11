import { TermsUseUnpublishVo } from '@pages/content-management/domain/value-objects/terms-use/terms-use-unpublish.vo';

export class TermsUseUnpublishEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: TermsUseUnpublishVo): TermsUseUnpublishEntity {
        return new TermsUseUnpublishEntity(vo.uniqId);
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
