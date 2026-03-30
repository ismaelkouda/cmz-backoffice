import { UsersFindOneItemApiDto } from '@pages/settings-security/infrastructure/api/dto/users/users-find-one-response-api.dto';

export class UsersFindOneEntity {
    constructor(
        public readonly uniqId: string,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly phone: string,
        public readonly profile: string,
        public readonly responsibility: string,
        public readonly updatedAt: string
    ) {}

    static fromDto(dto: UsersFindOneItemApiDto): UsersFindOneEntity {
        return new UsersFindOneEntity(
            dto.id,
            dto.first_name,
            dto.last_name,
            dto.email,
            dto.phone,
            dto.profile.name,
            dto.responsibility.name,
            dto.updated_at
        );
    }

    public with(dto: UsersFindOneItemApiDto): UsersFindOneEntity {
        if (this.uniqId === dto.id && this.updatedAt === dto.updated_at) {
            return this;
        }
        return UsersFindOneEntity.fromDto(dto);
    }
}
