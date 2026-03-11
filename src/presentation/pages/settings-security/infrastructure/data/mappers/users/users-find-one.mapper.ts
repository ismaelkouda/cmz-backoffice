import { Injectable } from '@angular/core';
import { UsersFindOneEntity } from '@pages/settings-security/domain/entities/users/users-find-one.entity';
import { UsersFindOneItemApiDto } from '@pages/settings-security/infrastructure/api/dto/users/users-find-one-response-api.dto';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class UsersFindOneMapper extends SimpleResponseMapper<
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
