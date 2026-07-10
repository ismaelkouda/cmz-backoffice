import { InfrastructureDeleteVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure/infrastructure-delete.vo';

export class InfrastructureDeleteEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: InfrastructureDeleteVo): InfrastructureDeleteEntity {
        return new InfrastructureDeleteEntity(vo.uniqId);
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
