import { Injectable } from '@angular/core';
import { InfrastructureTypeFindOneEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-find-one.entity';
import { InfrastructureTypeFindOneProps } from '@presentation/pages/administrative-infrastructure/domain/interfaces/infrastructure-type/infrastructure-type-find-one-props.interface';
import { InfrastructureTypeFindOneItemApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-find-one-response-api.dto';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class InfrastructureTypeFindOneMapper extends SimpleResponseMapper<
    InfrastructureTypeFindOneEntity,
    InfrastructureTypeFindOneItemApiDto
> {
    private readonly entityCache = new Map<
        string,
        InfrastructureTypeFindOneEntity
    >();

    protected mapItemFromDto(
        dto: InfrastructureTypeFindOneItemApiDto
    ): InfrastructureTypeFindOneEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const props: InfrastructureTypeFindOneProps = {
            uniqId: dto.id,
            name: dto.name,
            description: dto.description,
            tag: dto.tag,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new InfrastructureTypeFindOneEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
