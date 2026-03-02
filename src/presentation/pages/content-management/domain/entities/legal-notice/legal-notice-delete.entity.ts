import { LegalNoticeDeleteVo } from '@presentation/pages/content-management/domain/value-objects/legal-notice/legal-notice-delete.vo';

export class LegalNoticeDeleteEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: LegalNoticeDeleteVo): LegalNoticeDeleteEntity {
        return new LegalNoticeDeleteEntity(vo.uniqId);
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
