import { inject, Injectable } from '@angular/core';
import { UsersEntity } from '@pages/settings-security/domain/entities/users/users.entity';
import { UsersItemApiDto } from '@pages/settings-security/infrastructure/api/dto/users/users-response-api.dto';
import { StatusMapper } from '@pages/settings-security/infrastructure/data/mappers/users/users-status.mapper';
import { UsersProps } from '@presentation/pages/settings-security/domain/interfaces/users/users-props.interface';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { ProfilesMapper } from '@shared/data/mappers/profiles.mapper';
import { RolesMapper } from '@shared/data/mappers/roles.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({
    providedIn: 'root',
})
export class UsersMapper extends PaginatedMapper<UsersEntity, UsersItemApiDto> {
    private readonly profilesMapper: ProfilesMapper = inject(ProfilesMapper);
    private readonly rolesMapper: RolesMapper = inject(RolesMapper);
    private readonly statusMapper = inject(StatusMapper);
    private readonly entityCache = new Map<string, UsersEntity>();

    protected mapItemFromDto(dto: UsersItemApiDto): UsersEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const props: UsersProps = {
            uniqId: dto.id,
            lastName: dto.last_name,
            firstName: dto.first_name,
            email: dto.email,
            phone: dto.phone,
            profile: dto.profile,
            role: this.rolesMapper.mapFromDto(dto.role),
            status: this.statusMapper.mapFromDto(dto.status),
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(props) : new UsersEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
