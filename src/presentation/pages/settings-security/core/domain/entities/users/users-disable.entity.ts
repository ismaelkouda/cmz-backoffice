import { UsersDisableVo } from '@presentation/pages/settings-security/core/domain/value-objects/users/users-disable.vo';

export class UsersDisableEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: UsersDisableVo): UsersDisableEntity {
        return new UsersDisableEntity(vo.uniqId);
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
