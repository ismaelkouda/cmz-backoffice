import { Injectable } from '@angular/core';
import { ReportMediaDto } from '@shared/data/dtos/report-media.dto';
import { ReportMediaEntity } from '@shared/domain/entities/report-media.entity';
@Injectable({
    providedIn: 'root',
})
export class ReportMediaMapper {
    mapToEntity(dtoValue: ReportMediaDto | null): ReportMediaEntity | null {
        if (!dtoValue) return null;

        return new ReportMediaEntity(
            dtoValue.place_photo,
            dtoValue.access_place_photo
        );
    }

    mapToDto(entityValue: ReportMediaEntity | null): ReportMediaDto | null {
        if (!entityValue) return null;

        return {
            place_photo: entityValue.placePhoto,
            access_place_photo: entityValue.accessPlacePhoto,
        };
    }
}
