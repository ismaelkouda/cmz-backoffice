import { Injectable } from '@angular/core';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';

import { MapEntity } from '../../../domain/entities/map/map.entity';
import { MapItemDto } from '../../api/dto/map/map-response.dto';

@Injectable({ providedIn: 'root' })
export class MapMapper extends SimpleResponseMapper<MapEntity, MapItemDto> {
    protected override mapItemFromDto(dto: MapItemDto): MapEntity {
        return new MapEntity(dto.mapLink);
    }
}
