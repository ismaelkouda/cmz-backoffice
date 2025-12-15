import { inject } from "@angular/core";
import { DetailsItemDto } from "@presentation/pages/reports-processing/data/dtos/details/details-response.dto";
import { ReportLocationEntity } from "@shared/domain/entities/report-location.entity";
import { LocationMethodMapper } from "./location-method.mapper";
import { LocationTypeMapper } from "./location-type.mapper";

import { Injectable } from "@angular/core";
@Injectable({
    providedIn: 'root'
})

export class LocationMapper {
    private readonly locationMethodMapper = inject(LocationMethodMapper);
    private readonly locationTypeMapper = inject(LocationTypeMapper);

    mapToEntity(dto: DetailsItemDto): ReportLocationEntity {
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