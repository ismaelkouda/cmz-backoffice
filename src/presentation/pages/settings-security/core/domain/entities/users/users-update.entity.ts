import { UsersUpdateVo } from '../../value-objects/users/users-update.vo';

export class UsersUpdateEntity {
    constructor(
        public readonly uniqId: string,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly phone: string,
        public readonly profile: string,
        public readonly responsibility: string
    ) {}
    static fromVo(vo: UsersUpdateVo): UsersUpdateEntity {
        return new UsersUpdateEntity(
            vo.uniqId,
            vo.firstName,
            vo.lastName,
            vo.email,
            vo.phone,
            vo.profile,
            vo.responsibility
        );
    }
}
