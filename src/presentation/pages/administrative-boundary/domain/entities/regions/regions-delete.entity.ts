import { RegionsDeleteVo } from '@presentation/pages/administrative-boundary/domain/value-objects/regions/regions-delete.vo';

export class RegionsDeleteEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: RegionsDeleteVo): RegionsDeleteEntity {
        return new RegionsDeleteEntity(vo.uniqId);
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
