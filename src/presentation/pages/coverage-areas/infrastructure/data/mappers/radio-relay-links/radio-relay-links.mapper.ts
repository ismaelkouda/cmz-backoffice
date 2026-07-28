import { Injectable } from '@angular/core';
import { RadioRelayLinksEntity } from '@pages/coverage-areas/domain/entities/radio-relay-links/radio-relay-links.entity';
import { RadioRelayLinksItemApiDto } from '@pages/coverage-areas/infrastructure/api/dto/radio-relay-links/radio-relay-links-response-api.dto';
import { RadioRelayLinksProps } from '@pages/coverage-areas/domain/interfaces/radio-relay-links/radio-relay-links-props.interface';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';
import { RadioRelayLinksStatus } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-status.enum';
import { RadioRelayLinksOperator } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-operator.enum';
import { RadioRelayLinksFrequency } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-frequency.enum';

@Injectable({
    providedIn: 'root',
})
export class RadioRelayLinksMapper extends PaginatedMapper<
    RadioRelayLinksEntity,
    RadioRelayLinksItemApiDto
> {
    private readonly entityCache = new Map<string, RadioRelayLinksEntity>();

    protected mapItemFromDto(
        dto: RadioRelayLinksItemApiDto
    ): RadioRelayLinksEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const props: RadioRelayLinksProps = {
            uniqId: dto.id,
            name: dto.name,
            operator: dto.operator as RadioRelayLinksOperator,
            frequency: dto.frequency as RadioRelayLinksFrequency,
            startDate: new Date(dto.start_date),
            endDate: new Date(dto.end_date),
            status: dto.is_active
                ? RadioRelayLinksStatus.ACTIVE
                : RadioRelayLinksStatus.INACTIVE,
            updatedAt: new Date(dto.updated_at),
        };

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new RadioRelayLinksEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
