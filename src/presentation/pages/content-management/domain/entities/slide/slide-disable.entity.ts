import { SlideDisableVo } from '@pages/content-management/domain/value-objects/slide/slide-disable.vo';

export class SlideDisableEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: SlideDisableVo): SlideDisableEntity {
        return new SlideDisableEntity(vo.uniqId);
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
