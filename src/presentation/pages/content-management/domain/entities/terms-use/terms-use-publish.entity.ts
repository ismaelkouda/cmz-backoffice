import { TermsUsePublishVo } from '@pages/content-management/domain/value-objects/terms-use/terms-use-publish.vo';

export class TermsUsePublishEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: TermsUsePublishVo): TermsUsePublishEntity {
        return new TermsUsePublishEntity(vo.uniqId);
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
