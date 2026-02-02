import { UsersItemApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/users/users-response-api.dto';

export class UsersEntity {
    constructor(
        public readonly uniqId: string,
        public firstName: string,
        public lastName: string,
        public email: string,
        public phone: string,
        public profile: string,
        public responsibility: string,
        public isActive: boolean,
        public createdAt: string
    ) {}

    static fromDto(dto: UsersItemApiDto): UsersEntity {
        return new UsersEntity(
            dto.id,
            dto.first_name,
            dto.last_name,
            dto.email,
            dto.phone,
            dto.profile,
            dto.responsibility,
            dto.is_active,
            dto.created_at
        );
    }

    public with(dto: UsersItemApiDto): UsersEntity {
        if (this.createdAt === dto.created_at) {
            return this;
        }
        return UsersEntity.fromDto(dto);
    }
}
