import { ProfilesSelectItemApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/users/profiles-select-api.dto';

export class ProfilesSelectEntity {
    constructor(
        public readonly value: string,
        public readonly label: string
    ) {}

    static fromDto(dto: ProfilesSelectItemApiDto): ProfilesSelectEntity {
        return new ProfilesSelectEntity(dto.code, dto.name);
    }

    public with(dto: ProfilesSelectItemApiDto): ProfilesSelectEntity {
        if (this.value === dto.code && this.label === dto.name) {
            return this;
        }
        return ProfilesSelectEntity.fromDto(dto);
    }
}
