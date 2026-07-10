import { InfrastructureTypeDeleteVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure-type/infrastructure-type-delete.vo';

export class InfrastructureTypeDeleteEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(
        vo: InfrastructureTypeDeleteVo
    ): InfrastructureTypeDeleteEntity {
        return new InfrastructureTypeDeleteEntity(vo.uniqId);
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
