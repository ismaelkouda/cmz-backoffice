import { UsersFilterDto } from '@presentation/pages/settings-security/core/application/dto/users/users-filter.dto';

export class UsersFilterVo {
    public readonly search?: string;
    public readonly profile?: string;
    public readonly responsibility?: string;
    public readonly isActive?: string;

    constructor(props: {
        search?: string;
        profile?: string;
        responsibility?: string;
        isActive?: string;
    }) {
        this.search = props.search;
        this.profile = props.profile;
        this.responsibility = props.responsibility;
        this.isActive = props.isActive;
    }

    static fromDto(
        dto: UsersFilterDto | null = {} as UsersFilterDto
    ): UsersFilterVo {
        return new UsersFilterVo({
            search: dto?.search?.trim() || undefined,
            profile: dto?.profile,
            responsibility: dto?.responsibility,
            isActive: dto?.isActive,
        });
    }
}
