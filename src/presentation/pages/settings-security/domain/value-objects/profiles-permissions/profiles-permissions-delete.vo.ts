import { ProfilesPermissionsDeleteDto } from '@presentation/pages/settings-security/application/dto/profiles-permissions/profiles-permissions-delete.dto';

export class ProfilesPermissionsDeleteVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(
        dto: ProfilesPermissionsDeleteDto
    ): ProfilesPermissionsDeleteVo {
        return new ProfilesPermissionsDeleteVo({
            uniqId: dto.uniqId.trim(),
        });
    }
}
