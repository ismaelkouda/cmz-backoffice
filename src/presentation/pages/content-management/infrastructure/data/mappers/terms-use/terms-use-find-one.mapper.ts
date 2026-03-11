import { Injectable } from '@angular/core';
import {
    TermsUseFindOneEntity,
    TermsUseFindOneProps,
} from '@pages/content-management/domain/entities/terms-use/terms-use-find-one.entity';
import { TermsUseFindOneItemApiDto } from '@pages/content-management/infrastructure/api/dto/terms-use/terms-use-find-one-response-api.dto';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class TermsUseFindOneMapper extends SimpleResponseMapper<
    TermsUseFindOneEntity,
    TermsUseFindOneItemApiDto
> {
    private readonly entityCache = new Map<string, TermsUseFindOneEntity>();

    protected mapItemFromDto(
        dto: TermsUseFindOneItemApiDto
    ): TermsUseFindOneEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const props: TermsUseFindOneProps = {
            uniqId: dto.id,
            lastName: dto.last_name,
            firstName: dto.first_name,
            email: dto.email,
            phone: dto.phone,
            role: dto.role,
        };

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new TermsUseFindOneEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
