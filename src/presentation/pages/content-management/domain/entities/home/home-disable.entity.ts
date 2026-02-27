import { HomeDisableVo } from '@presentation/pages/content-management/domain/value-objects/home/home-disable.vo';

export class HomeDisableEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: HomeDisableVo): HomeDisableEntity {
        return new HomeDisableEntity(vo.uniqId);
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
