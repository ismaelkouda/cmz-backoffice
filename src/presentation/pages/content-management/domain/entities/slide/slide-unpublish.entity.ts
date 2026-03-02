import { SlideUnpublishVo } from '@presentation/pages/content-management/domain/value-objects/slide/slide-unpublish.vo';

export class SlideUnpublishEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: SlideUnpublishVo): SlideUnpublishEntity {
        return new SlideUnpublishEntity(vo.uniqId);
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
