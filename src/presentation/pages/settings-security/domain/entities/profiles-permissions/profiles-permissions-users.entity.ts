import { ProfilesPermissionsUsersItemApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-users-response-api.dto';

export class ProfilesPermissionsUsersEntity {
    constructor(
        public readonly uniqId: string,
        public email: string,
        public phone: string,
        public firstName: string,
        public lastName: string,
        public updatedAt: string
    ) {}

    static fromDto(
        dto: ProfilesPermissionsUsersItemApiDto
    ): ProfilesPermissionsUsersEntity {
        return new ProfilesPermissionsUsersEntity(
            dto.id,
            dto.email,
            dto.phone,
            dto.first_name,
            dto.last_name,
            dto.updated_at
        );
    }

    public with(
        dto: ProfilesPermissionsUsersItemApiDto
    ): ProfilesPermissionsUsersEntity {
        if (this.uniqId === dto.id && this.updatedAt === dto.updated_at) {
            return this;
        }
        return ProfilesPermissionsUsersEntity.fromDto(dto);
    }
}
