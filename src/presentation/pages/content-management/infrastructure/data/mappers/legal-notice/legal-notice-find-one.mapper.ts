import { Injectable } from '@angular/core';
import {
    LegalNoticeFindOneEntity,
    LegalNoticeFindOneProps,
} from '@pages/content-management/domain/entities/legal-notice/legal-notice-find-one.entity';
import { LegalNoticeFindOneItemApiDto } from '@pages/content-management/infrastructure/api/dto/legal-notice/legal-notice-find-one-response-api.dto';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class LegalNoticeFindOneMapper extends SimpleResponseMapper<
    LegalNoticeFindOneEntity,
    LegalNoticeFindOneItemApiDto
> {
    private readonly entityCache = new Map<string, LegalNoticeFindOneEntity>();

    protected mapItemFromDto(
        dto: LegalNoticeFindOneItemApiDto
    ): LegalNoticeFindOneEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const props: LegalNoticeFindOneProps = {
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
            : new LegalNoticeFindOneEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
