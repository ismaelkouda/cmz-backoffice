import { ProfilesPermissionsFilterDto } from '@presentation/pages/settings-security/application/dto/profiles-permissions/profiles-permissions-filter.dto';

export class ProfilesPermissionsFilterVo {
    public readonly search?: string;
    public readonly user?: string;
    public readonly isActive?: string;

    constructor(props: { search?: string; user?: string; isActive?: string }) {
        this.search = props.search;
        this.user = props.user;
        this.isActive = props.isActive;
    }

    static fromDto(
        dto: ProfilesPermissionsFilterDto | null = {} as ProfilesPermissionsFilterDto
    ): ProfilesPermissionsFilterVo {
        return new ProfilesPermissionsFilterVo({
            search: dto?.search?.trim() || undefined,
            user: dto?.user,
            isActive: dto?.isActive,
        });
    }
}
