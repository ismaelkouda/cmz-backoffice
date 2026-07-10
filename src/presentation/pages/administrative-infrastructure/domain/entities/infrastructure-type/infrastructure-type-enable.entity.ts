import { InfrastructureTypeEnableVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure-type/infrastructure-type-enable.vo';

export class InfrastructureTypeEnableEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(
        vo: InfrastructureTypeEnableVo
    ): InfrastructureTypeEnableEntity {
        return new InfrastructureTypeEnableEntity(vo.uniqId);
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
