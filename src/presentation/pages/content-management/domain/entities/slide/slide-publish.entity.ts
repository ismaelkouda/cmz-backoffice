import { SlidePublishVo } from '@presentation/pages/content-management/domain/value-objects/slide/slide-publish.vo';

export class SlidePublishEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: SlidePublishVo): SlidePublishEntity {
        return new SlidePublishEntity(vo.uniqId);
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
