import { UsersCreateVo } from '@pages/settings-security/domain/value-objects/users/users-create.vo';

export class UsersCreateEntity {
    constructor(
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly phone: string,
        public readonly profile: string,
        public readonly role: string
    ) {}

    static fromVo(vo: UsersCreateVo): UsersCreateEntity {
        return new UsersCreateEntity(
            vo.firstName,
            vo.lastName,
            vo.email,
            vo.phone,
            vo.profile,
            vo.role
        );
    }
}
