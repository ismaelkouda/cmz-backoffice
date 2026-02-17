import { UsersEnableVo } from '@presentation/pages/settings-security/core/domain/value-objects/users/users-enable.vo';

export class UsersEnableEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: UsersEnableVo): UsersEnableEntity {
        return new UsersEnableEntity(vo.uniqId);
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
