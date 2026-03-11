import { UsersFindOneFilterVo } from '@pages/settings-security/domain/value-objects/users/users-find-one-filter.vo';

export class UsersFindOneFilterEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: UsersFindOneFilterVo): UsersFindOneFilterEntity {
        return new UsersFindOneFilterEntity(vo.uniqId);
    }
}
