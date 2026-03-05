import { Injectable } from '@angular/core';

import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import { UsersSelectEntity } from '@presentation/pages/settings-security/domain/entities/users/users-select.entity';
import { UsersSelectItemApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/users/users-select-api.dto';

@Injectable({ providedIn: 'root' })
export class UsersSelectMapper extends ArrayResponseMapper<
    UsersSelectEntity,
    UsersSelectItemApiDto
> {
    private readonly entityCache = new Map<string, UsersSelectEntity>();

    protected mapItemFromDto(dto: UsersSelectItemApiDto): UsersSelectEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : UsersSelectEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
