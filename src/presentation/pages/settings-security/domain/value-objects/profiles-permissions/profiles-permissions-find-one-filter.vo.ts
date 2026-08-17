import { ProfilesPermissionsFindOneFilterDto } from '../../../application/dto/profiles-permissions/profiles-permissions-find-one-filter.dto';

export class ProfilesPermissionsFindOneFilterVo {
    public readonly uniqId?: string;

    constructor(props: { uniqId?: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(
        dto: ProfilesPermissionsFindOneFilterDto | null = {} as ProfilesPermissionsFindOneFilterDto
    ): ProfilesPermissionsFindOneFilterVo {
        return new ProfilesPermissionsFindOneFilterVo({
            uniqId: dto?.uniqId,
        });
    }
}
