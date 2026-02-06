import { Injectable } from '@angular/core';

import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/utils/utils/mappers/mapper-utils';

import { UsersFindOneEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users-findone.entity';
import { UsersFindOneItemApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/users/users-findone-response-api.dto';

@Injectable({ providedIn: 'root' })
export class UsersFindonMapper extends SimpleResponseMapper<
    UsersFindOneEntity,
    UsersFindOneItemApiDto
> {
    private readonly entityCache = new Map<string, UsersFindOneEntity>();

    protected mapItemFromDto(dto: UsersFindOneItemApiDto): UsersFindOneEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : UsersFindOneEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
