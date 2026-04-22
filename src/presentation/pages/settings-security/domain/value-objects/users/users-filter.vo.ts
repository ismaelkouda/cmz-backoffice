import { UsersFilterDto } from '@pages/settings-security/application/dto/users/users-filter.dto';

export class UsersFilterVo {
    public readonly search?: string;
    public readonly profile?: string;
    public readonly role?: string;
    public readonly isActive?: string;

    constructor(props: {
        search?: string;
        profile?: string;
        role?: string;
        isActive?: string;
    }) {
        this.search = props.search;
        this.profile = props.profile;
        this.role = props.role;
        this.isActive = props.isActive;
    }

    static fromDto(
        dto: UsersFilterDto | null = {} as UsersFilterDto
    ): UsersFilterVo {
        return new UsersFilterVo({
            search: dto?.search?.trim() || undefined,
            profile: dto?.profile,
            role: dto?.role,
            isActive: dto?.isActive,
        });
    }
}
