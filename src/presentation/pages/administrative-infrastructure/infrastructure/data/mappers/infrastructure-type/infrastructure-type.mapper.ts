import { Injectable } from '@angular/core';
import { InfrastructureTypeEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type.entity';
import { InfrastructureTypeItemApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-response-api.dto';
import { InfrastructureTypeProps } from '@presentation/pages/administrative-infrastructure/domain/interfaces/infrastructure-type/infrastructure-type-props.interface';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';
import { Status } from '@pages/administrative-infrastructure/domain/enums/infrastructure-type/infrastructure-type-status.enum';

@Injectable({
    providedIn: 'root',
})
export class InfrastructureTypeMapper extends PaginatedMapper<
    InfrastructureTypeEntity,
    InfrastructureTypeItemApiDto
> {
    private readonly entityCache = new Map<string, InfrastructureTypeEntity>();

    protected mapItemFromDto(
        dto: InfrastructureTypeItemApiDto
    ): InfrastructureTypeEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const props: InfrastructureTypeProps = {
            uniqId: dto.id,
            name: dto.name,
            description: dto.description,
            status: dto.is_active ? Status.ACTIVE : Status.INACTIVE,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new InfrastructureTypeEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
