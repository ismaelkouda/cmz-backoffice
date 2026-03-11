import { Injectable } from '@angular/core';
import { LocationMethodDto } from '@shared/data/dto/location-method.dto';
import { LocationMethod } from '@shared/domain/enums/location-method.enum';

@Injectable({
    providedIn: 'root',
})
export class LocationMethodMapper {
    mapToEnum(dtoValue: LocationMethodDto): LocationMethod {
        if (dtoValue === null || dtoValue === undefined) {
            return LocationMethod.UNKNOWN;
        }
        const methodMap: Record<LocationMethodDto, LocationMethod> = {
            [LocationMethodDto.AUTO]: LocationMethod.AUTO,
            [LocationMethodDto.MANUAL]: LocationMethod.MANUAL,
            [LocationMethodDto.UNKNOWN]: LocationMethod.UNKNOWN,
        };
        return methodMap[dtoValue] || LocationMethod.UNKNOWN;
    }

    mapToDto(enumValue: LocationMethod): LocationMethodDto {
        if (enumValue === null || enumValue === undefined) {
            return LocationMethodDto.UNKNOWN;
        }
        const mapping: Record<LocationMethod, LocationMethodDto> = {
            [LocationMethod.AUTO]: LocationMethodDto.AUTO,
            [LocationMethod.MANUAL]: LocationMethodDto.MANUAL,
            [LocationMethod.UNKNOWN]: LocationMethodDto.UNKNOWN,
        };
        return mapping[enumValue] || LocationMethodDto.UNKNOWN;
    }
}
