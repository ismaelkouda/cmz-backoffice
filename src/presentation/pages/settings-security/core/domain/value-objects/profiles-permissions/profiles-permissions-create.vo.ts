import { ProfilesPermissionsCreateDto } from '@presentation/pages/settings-security/core/application/dto/profiles-permissions/profiles-permissions-create.dto';

export class ProfilesPermissionsCreateVo {
    readonly name: string;
    readonly description: string;
    readonly permissions: string[];

    private constructor(props: {
        name: string;
        description: string;
        permissions: string[];
    }) {
        this.name = props.name;
        this.description = props.description;
        this.permissions = props.permissions;
    }

    static fromDto(
        dto: ProfilesPermissionsCreateDto
    ): ProfilesPermissionsCreateVo {
        return new ProfilesPermissionsCreateVo({
            name: dto.name,
            description: dto.description,
            permissions: dto.permissions,
        });
    }
}
