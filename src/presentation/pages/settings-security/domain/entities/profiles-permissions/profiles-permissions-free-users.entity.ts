import { ProfilesPermissionsFreeUsersItemApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-free-users-response-api.dto';

export class ProfilesPermissionsFreeUsersEntity {
    constructor(
        public readonly uniqId: string,
        public email: string,
        public phone: string,
        public firstName: string,
        public lastName: string,
        public updatedAt: string
    ) {}

    static fromDto(
        dto: ProfilesPermissionsFreeUsersItemApiDto
    ): ProfilesPermissionsFreeUsersEntity {
        return new ProfilesPermissionsFreeUsersEntity(
            dto.uniq_id,
            dto.email,
            dto.phone,
            dto.first_name,
            dto.last_name,
            dto.updated_at
        );
    }

    public with(
        dto: ProfilesPermissionsFreeUsersItemApiDto
    ): ProfilesPermissionsFreeUsersEntity {
        if (this.uniqId === dto.uniq_id && this.updatedAt === dto.updated_at) {
            return this;
        }
        return ProfilesPermissionsFreeUsersEntity.fromDto(dto);
    }
}
