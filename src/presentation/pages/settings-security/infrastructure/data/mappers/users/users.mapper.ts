import { Injectable } from '@angular/core';
import { UsersEntity } from '@pages/settings-security/domain/entities/users/users.entity';
import { UsersItemApiDto } from '@pages/settings-security/infrastructure/api/dto/users/users-response-api.dto';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({
    providedIn: 'root',
})
export class UsersMapper extends PaginatedMapper<UsersEntity, UsersItemApiDto> {
    private readonly entityCache = new Map<string, UsersEntity>();

    protected mapItemFromDto(dto: UsersItemApiDto): UsersEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(dto) : UsersEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
