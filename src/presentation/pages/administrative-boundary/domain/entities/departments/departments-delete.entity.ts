import { DepartmentsDeleteVo } from '@presentation/pages/administrative-boundary/domain/value-objects/departments/departments-delete.vo';

export class DepartmentsDeleteEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: DepartmentsDeleteVo): DepartmentsDeleteEntity {
        return new DepartmentsDeleteEntity(vo.uniqId);
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
