import { SlideEnableVo } from '@pages/content-management/domain/value-objects/slide/slide-enable.vo';

export class SlideEnableEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: SlideEnableVo): SlideEnableEntity {
        return new SlideEnableEntity(vo.uniqId);
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
