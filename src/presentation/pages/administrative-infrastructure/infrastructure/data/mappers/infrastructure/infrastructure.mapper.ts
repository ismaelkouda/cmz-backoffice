import { Injectable } from '@angular/core';
import { InfrastructureEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure.entity';
import { InfrastructureItemApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure/infrastructure-response-api.dto';
import { InfrastructureProps } from '@presentation/pages/administrative-infrastructure/domain/interfaces/infrastructure/infrastructure-props.interface';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({
    providedIn: 'root',
})
export class InfrastructureMapper extends PaginatedMapper<
    InfrastructureEntity,
    InfrastructureItemApiDto
> {
    private readonly entityCache = new Map<string, InfrastructureEntity>();

    protected mapItemFromDto(
        dto: InfrastructureItemApiDto
    ): InfrastructureEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const props: InfrastructureProps = {
            uniqId: dto.id,
            name: dto.name,
            type: dto.infrastructure_type,
            description: dto.description,
            region: dto.region?.name,
            department: dto.department?.name,
            municipality: dto.municipality?.name,
            position: dto.position,
            createdAt: dto.created_at,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new InfrastructureEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
