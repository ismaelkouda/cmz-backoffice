import { InfrastructureTypeDisableVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure-type/infrastructure-type-disable.vo';

export class InfrastructureTypeDisableEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(
        vo: InfrastructureTypeDisableVo
    ): InfrastructureTypeDisableEntity {
        return new InfrastructureTypeDisableEntity(vo.uniqId);
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
