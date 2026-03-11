import { SlideDeleteVo } from '@pages/content-management/domain/value-objects/slide/slide-delete.vo';

export class SlideDeleteEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: SlideDeleteVo): SlideDeleteEntity {
        return new SlideDeleteEntity(vo.uniqId);
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
