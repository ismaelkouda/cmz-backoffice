import { ProfilesPermissionsSelectItemApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-select-api.dto';

export class ProfilesPermissionsSelectEntity {
    constructor(
        public readonly value: string,
        public readonly label: string
    ) {}

    static fromDto(
        dto: ProfilesPermissionsSelectItemApiDto
    ): ProfilesPermissionsSelectEntity {
        return new ProfilesPermissionsSelectEntity(dto.code, dto.name);
    }

    public with(
        dto: ProfilesPermissionsSelectItemApiDto
    ): ProfilesPermissionsSelectEntity {
        if (this.value === dto.code && this.label === dto.name) {
            return this;
        }
        return ProfilesPermissionsSelectEntity.fromDto(dto);
    }
}
