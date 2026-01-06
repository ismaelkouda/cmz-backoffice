import { LocationType } from '@shared/domain/enums/location-type.enum';
import { LocationTypeDto } from '../dtos/location-type.dto';

import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root',
})
export class LocationTypeMapper {
    mapToEnum(dtoValue: LocationTypeDto): LocationType {
        if (dtoValue == null) {
            return LocationType.UNKNOWN;
        }
        const methodMap: Record<LocationTypeDto, LocationType> = {
            [LocationTypeDto.GPS]: LocationType.GPS,
            [LocationTypeDto.NETWORK]: LocationType.NETWORK,
            [LocationTypeDto.MANUAL]: LocationType.MANUAL,
            [LocationTypeDto.UNKNOWN]: LocationType.UNKNOWN,
        };
        return methodMap[dtoValue] || LocationType.UNKNOWN;
    }

    mapToDto(enumValue: LocationType): LocationTypeDto {
        if (enumValue == null) {
            return LocationTypeDto.UNKNOWN;
        }
        const mapping: Record<LocationType, LocationTypeDto> = {
            [LocationType.GPS]: LocationTypeDto.GPS,
            [LocationType.NETWORK]: LocationTypeDto.NETWORK,
            [LocationType.MANUAL]: LocationTypeDto.MANUAL,
            [LocationType.UNKNOWN]: LocationTypeDto.UNKNOWN,
        };
        return mapping[enumValue] || LocationTypeDto.UNKNOWN;
    }
}
