import { ProfilesPermissionsUpdateDto } from '@pages/settings-security/application/dto/profiles-permissions/profiles-permissions-update.dto';

export class ProfilesPermissionsUpdateVo {
    readonly uniqId: string;
    readonly name: string;
    readonly description: string;
    readonly permissions: Record<string, string[]>;

    private constructor(props: {
        uniqId: string;
        name: string;
        description: string;
        permissions: Record<string, string[]>;
    }) {
        this.uniqId = props.uniqId;
        this.name = props.name;
        this.description = props.description;
        this.permissions = props.permissions;
    }

    static fromDto(
        dto: ProfilesPermissionsUpdateDto
    ): ProfilesPermissionsUpdateVo {
        return new ProfilesPermissionsUpdateVo({
            uniqId: dto.uniqId,
            name: dto.name,
            description: dto.description,
            permissions: dto.permissions,
        });
    }
}
