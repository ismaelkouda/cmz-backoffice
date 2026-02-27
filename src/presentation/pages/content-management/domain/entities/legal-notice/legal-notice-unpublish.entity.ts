import { LegalNoticeUnpublishVo } from '@presentation/pages/content-management/domain/value-objects/legal-notice/legal-notice-unpublish.vo';

export class LegalNoticeUnpublishEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: LegalNoticeUnpublishVo): LegalNoticeUnpublishEntity {
        return new LegalNoticeUnpublishEntity(vo.uniqId);
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
