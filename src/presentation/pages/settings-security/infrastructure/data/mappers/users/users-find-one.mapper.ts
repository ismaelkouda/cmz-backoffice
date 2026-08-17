import { Injectable } from '@angular/core';
import {
    UsersFindOneEntity,
    UsersFindOneProps,
} from '@pages/settings-security/domain/entities/users/users-find-one.entity';
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

        const props: UsersFindOneProps = {
            uniqId: dto.id,
            lastName: dto.last_name,
            firstName: dto.first_name,
            email: dto.email,
            phone: dto.phone,
            profile: dto.profile_id,
            role: dto.role,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new UsersFindOneEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
