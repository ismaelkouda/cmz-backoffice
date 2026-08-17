import { ProfilesPermissionsSelectItemApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-select-response-api.dto';

export class ProfilesPermissionsSelectEntity {
    constructor(
        public readonly value: string,
        public readonly label: string
    ) {}

    static fromDto(
        dto: ProfilesPermissionsSelectItemApiDto
    ): ProfilesPermissionsSelectEntity {
        return new ProfilesPermissionsSelectEntity(dto.uniq_id, dto.name);
    }

    public with(
        dto: ProfilesPermissionsSelectItemApiDto
    ): ProfilesPermissionsSelectEntity {
        if (this.value === dto.uniq_id && this.label === dto.name) {
            return this;
        }
        return ProfilesPermissionsSelectEntity.fromDto(dto);
    }
}
