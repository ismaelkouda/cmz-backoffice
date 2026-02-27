import { HomeDeleteVo } from '@presentation/pages/content-management/domain/value-objects/home/home-delete.vo';

export class HomeDeleteEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: HomeDeleteVo): HomeDeleteEntity {
        return new HomeDeleteEntity(vo.uniqId);
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
