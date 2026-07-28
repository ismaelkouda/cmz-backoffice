import { Injectable } from '@angular/core';
import { RadioRelayLinksFindOneEntity } from '@pages/coverage-areas/domain/entities/radio-relay-links/radio-relay-links-find-one.entity';
import { RadioRelayLinksFindOneItemApiDto } from '@pages/coverage-areas/infrastructure/api/dto/radio-relay-links/radio-relay-links-find-one-response-api.dto';
import { RadioRelayLinksFindOneProps } from '@pages/coverage-areas/domain/interfaces/radio-relay-links/radio-relay-links-props.interface';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';
import { RadioRelayLinksStatus } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-status.enum';
import { RadioRelayLinksOperator } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-operator.enum';
import { RadioRelayLinksFrequency } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-frequency.enum';

@Injectable({
    providedIn: 'root',
})
export class RadioRelayLinksFindOneMapper extends SimpleResponseMapper<
    RadioRelayLinksFindOneEntity,
    RadioRelayLinksFindOneItemApiDto
> {
    private readonly entityCache = new Map<
        string,
        RadioRelayLinksFindOneEntity
    >();

    protected mapItemFromDto(
        dto: RadioRelayLinksFindOneItemApiDto
    ): RadioRelayLinksFindOneEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const props: RadioRelayLinksFindOneProps = {
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
            geomUrl: dto.geom_url,
            geom: dto.geom,
        };

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new RadioRelayLinksFindOneEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
