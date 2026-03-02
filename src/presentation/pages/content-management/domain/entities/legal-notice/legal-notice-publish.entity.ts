import { LegalNoticePublishVo } from '@presentation/pages/content-management/domain/value-objects/legal-notice/legal-notice-publish.vo';

export class LegalNoticePublishEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: LegalNoticePublishVo): LegalNoticePublishEntity {
        return new LegalNoticePublishEntity(vo.uniqId);
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
