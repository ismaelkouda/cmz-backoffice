import { ProfilesPermissionsDisableDto } from '@pages/settings-security/application/dto/profiles-permissions/profiles-permissions-disable.dto';

export class ProfilesPermissionsDisableVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(
        dto: ProfilesPermissionsDisableDto
    ): ProfilesPermissionsDisableVo {
        return new ProfilesPermissionsDisableVo({
            uniqId: dto.uniqId,
        });
    }
}
