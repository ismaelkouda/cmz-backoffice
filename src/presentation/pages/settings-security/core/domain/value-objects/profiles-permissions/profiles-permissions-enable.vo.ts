import { ProfilesPermissionsEnableDto } from '@presentation/pages/settings-security/core/application/dto/profiles-permissions/profiles-permissions-enable.dto';

export class ProfilesPermissionsEnableVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(
        dto: ProfilesPermissionsEnableDto
    ): ProfilesPermissionsEnableVo {
        return new ProfilesPermissionsEnableVo({
            uniqId: dto.uniqId.trim(),
        });
    }
}
