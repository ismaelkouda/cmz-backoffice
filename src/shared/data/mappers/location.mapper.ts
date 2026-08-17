import { inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { LocationMethodDto } from '@shared/data/dto/location-method.dto';
import { LocationTypeDto } from '@shared/data/dto/location-type.dto';
import { LocationMethodMapper } from '@shared/data/mappers/location-method.mapper';
import { LocationTypeMapper } from '@shared/data/mappers/location-type.mapper';
import { ReportLocationEntity } from '@shared/domain/entities/report-location.entity';

@Injectable({
    providedIn: 'root',
})
export class LocationMapper {
    private readonly locationMethodMapper = inject(LocationMethodMapper);
    private readonly locationTypeMapper = inject(LocationTypeMapper);

    mapToEntity(dto: {
        lat: string;
        long: string;
        what3words: string;
        location_method: LocationMethodDto;
        location_type: LocationTypeDto;
        location_name: string;
        place_description: string;
    }): ReportLocationEntity {
        return {
            coordinates: {
                latitude: this.parseCoordinate(dto.lat),
                longitude: this.parseCoordinate(dto.long),
                what3words: dto.what3words,
            },
            method: this.locationMethodMapper.mapToEnum(dto.location_method),
            type: this.locationTypeMapper.mapToEnum(dto.location_type),
            name: dto.location_name,
            description: dto.place_description,
        };
    }

    private parseCoordinate(coord: string): number {
        const parsed = Number.parseFloat(coord);
        return Number.isNaN(parsed) ? 0 : parsed;
    }
}
