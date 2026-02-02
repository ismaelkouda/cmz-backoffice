import { UsersFindOneFilterVo } from '@presentation/pages/settings-security/core/domain/value-objects/users/users-findone-filter.vo';

export class UsersFindOneFilterEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: UsersFindOneFilterVo): UsersFindOneFilterEntity {
        return new UsersFindOneFilterEntity(vo.uniqId);
    }
}
