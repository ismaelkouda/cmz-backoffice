import { Injectable } from '@angular/core';
import { DetailsItemDto } from '@presentation/pages/reports-processing/data/dtos/details/details-response.dto';
import { CoordinatesEntity } from '@shared/domain/entities/coordinates.entity';
@Injectable({
    providedIn: 'root',
})
export class CoordinateMapper {
    mapFromDto(dto: DetailsItemDto): CoordinatesEntity {
        return new CoordinatesEntity(
            this.parseLatitude(dto.lat),
            this.parseLongitude(dto.long),
            this.normalizeWhat3Words(dto.what3words)
        );
    }

    private parseLatitude(lat: string): number {
        const parsed = parseFloat(lat);
        return isNaN(parsed) || parsed < -90 || parsed > 90 ? 0 : parsed;
    }

    private parseLongitude(long: string): number {
        const parsed = parseFloat(long);
        return isNaN(parsed) || parsed < -180 || parsed > 180 ? 0 : parsed;
    }

    private normalizeWhat3Words(words: string): string {
        if (!words) return '';
        return words.toLowerCase().replace(/[^\w\.]/g, '');
    }
}
