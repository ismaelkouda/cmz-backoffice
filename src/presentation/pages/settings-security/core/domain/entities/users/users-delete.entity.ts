import { UsersDeleteVo } from '@presentation/pages/settings-security/core/domain/value-objects/users/users-delete.vo';

export class UsersDeleteEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: UsersDeleteVo): UsersDeleteEntity {
        return new UsersDeleteEntity(vo.uniqId);
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
