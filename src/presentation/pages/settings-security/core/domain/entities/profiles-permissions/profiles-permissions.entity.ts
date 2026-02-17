import { ProfilesPermissionsItemApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-response-api.dto';

export class ProfilesPermissionsEntity {
    constructor(
        public readonly uniqId: string,
        public name: string,
        public slug: string,
        public description: string,
        public usersCount: string,
        public isActive: boolean,
        public createdAt: string
    ) {}

    static fromDto(
        dto: ProfilesPermissionsItemApiDto
    ): ProfilesPermissionsEntity {
        return new ProfilesPermissionsEntity(
            dto.uniq_id,
            dto.name,
            dto.slug,
            dto.description,
            dto.users_count,
            dto.is_active,
            dto.created_at
        );
    }

    public with(dto: ProfilesPermissionsItemApiDto): ProfilesPermissionsEntity {
        if (this.createdAt === dto.created_at) {
            return this;
        }
        return ProfilesPermissionsEntity.fromDto(dto);
    }
}
