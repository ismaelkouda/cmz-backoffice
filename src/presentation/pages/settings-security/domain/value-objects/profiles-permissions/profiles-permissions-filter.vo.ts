import { ProfilesPermissionsFilterDto } from '@pages/settings-security/application/dto/profiles-permissions/profiles-permissions-filter.dto';
import { Status } from '@pages/settings-security/domain/enums/profiles-permissions/profiles-permissions-status.enum';
export class ProfilesPermissionsFilterVo {
    public readonly search?: string;
    public readonly user?: string;
    public readonly status?: Status;

    constructor(props: { search?: string; user?: string; status?: Status }) {
        this.search = props.search;
        this.user = props.user;
        this.status = props.status;
    }

    static fromDto(
        dto: ProfilesPermissionsFilterDto | null = {} as ProfilesPermissionsFilterDto
    ): ProfilesPermissionsFilterVo {
        return new ProfilesPermissionsFilterVo({
            search: dto?.search?.trim() || undefined,
            user: dto?.user,
            status: dto?.status,
        });
    }
}
