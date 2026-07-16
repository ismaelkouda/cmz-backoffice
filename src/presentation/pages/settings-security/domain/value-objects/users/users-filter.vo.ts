import { UsersFilterDto } from '@pages/settings-security/application/dto/users/users-filter.dto';

export interface UsersFilterVo {
    search?: string;
    profile?: string;
    role?: string;
    isActive?: string;
}

export function usersFilterVo(
    dto: UsersFilterDto | null = {} as UsersFilterDto
): UsersFilterVo {
    return {
        search: dto?.search?.trim() || undefined,
        profile: dto?.profile,
        role: dto?.role,
        isActive: dto?.isActive,
    };
}
