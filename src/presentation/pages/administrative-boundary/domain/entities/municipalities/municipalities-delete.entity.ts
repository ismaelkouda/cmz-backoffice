import { MunicipalitiesDeleteVo } from '@pages/administrative-boundary/domain/value-objects/municipalities/municipalities-delete.vo';

export class MunicipalitiesDeleteEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: MunicipalitiesDeleteVo): MunicipalitiesDeleteEntity {
        return new MunicipalitiesDeleteEntity(vo.uniqId);
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
