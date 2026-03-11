import { UsersFindOneItemApiDto } from '@pages/settings-security/infrastructure/api/dto/users/users-find-one-response-api.dto';

export class UsersFindOneEntity {
    constructor(
        public readonly uniqId: string,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly phone: string,
        public readonly profile: string,
        public readonly responsibility: string
    ) {}

    static fromDto(dto: UsersFindOneItemApiDto): UsersFindOneEntity {
        return new UsersFindOneEntity(
            dto.id,
            dto.first_name,
            dto.last_name,
            dto.email,
            dto.phone,
            dto.profile.name,
            dto.responsibility.name
        );
    }

    public with(dto: UsersFindOneItemApiDto): UsersFindOneEntity {
        if (this.uniqId === dto.id) {
            return this;
        }
        return UsersFindOneEntity.fromDto(dto);
    }
}
