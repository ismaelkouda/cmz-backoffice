import { ProfilesPermissionsUsersFilterDto } from '@presentation/pages/settings-security/core/application/dto/profiles-permissions/profiles-permissions-users-filter.dto';

export class ProfilesPermissionsUsersFilterVo {
    public readonly uniqId: string;
    public readonly search?: string;
    public readonly userEmail?: string;
    public readonly phone?: string;

    constructor(props: {
        uniqId: string;
        search?: string;
        userEmail?: string;
        phone?: string;
    }) {
        this.uniqId = props.uniqId;
        this.search = props.search;
        this.userEmail = props.userEmail;
        this.phone = props.phone;
    }

    static fromDto(
        dto: ProfilesPermissionsUsersFilterDto | null = {} as ProfilesPermissionsUsersFilterDto
    ): ProfilesPermissionsUsersFilterVo {
        const uniqId = dto?.uniqId;
        const search = dto?.search?.trim() || undefined;
        const userEmail = dto?.userEmail?.trim() || undefined;
        const phone = dto?.phone?.trim() || undefined;

        if (!uniqId) {
            throw new Error(
                'uniqId is required to get ProfilesPermissions Users'
            );
        }

        return new ProfilesPermissionsUsersFilterVo({
            uniqId,
            search,
            userEmail,
            phone,
        });
    }
}
