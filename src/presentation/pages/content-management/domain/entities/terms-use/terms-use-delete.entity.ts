import { TermsUseDeleteVo } from '@presentation/pages/content-management/domain/value-objects/terms-use/terms-use-delete.vo';

export class TermsUseDeleteEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: TermsUseDeleteVo): TermsUseDeleteEntity {
        return new TermsUseDeleteEntity(vo.uniqId);
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
