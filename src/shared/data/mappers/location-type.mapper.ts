import { Injectable } from '@angular/core';

import { LocationTypeDto } from '@shared/data/dto/location-type.dto';
import { LocationType } from '@shared/domain/enums/location-type.enum';

@Injectable({
    providedIn: 'root',
})
export class LocationTypeMapper {
    mapToEnum(dtoValue: LocationTypeDto): LocationType {
        if (dtoValue === null || dtoValue === undefined) {
            return LocationType.UNKNOWN;
        }
        const methodMap: Record<LocationTypeDto, LocationType> = {
            [LocationTypeDto.GPS]: LocationType.GPS,
            [LocationTypeDto.NETWORK]: LocationType.NETWORK,
            [LocationTypeDto.MANUAL]: LocationType.MANUAL,
            [LocationTypeDto.WHAT3WORDS]: LocationType.WHAT3WORDS,
            [LocationTypeDto.UNKNOWN]: LocationType.UNKNOWN,
        };
        return methodMap[dtoValue] || LocationType.UNKNOWN;
    }

    mapToDto(enumValue: LocationType): LocationTypeDto {
        if (enumValue === null || enumValue === undefined) {
            return LocationTypeDto.UNKNOWN;
        }
        const mapping: Record<LocationType, LocationTypeDto> = {
            [LocationType.GPS]: LocationTypeDto.GPS,
            [LocationType.NETWORK]: LocationTypeDto.NETWORK,
            [LocationType.MANUAL]: LocationTypeDto.MANUAL,
            [LocationType.WHAT3WORDS]: LocationTypeDto.WHAT3WORDS,
            [LocationType.UNKNOWN]: LocationTypeDto.UNKNOWN,
        };
        return mapping[enumValue] || LocationTypeDto.UNKNOWN;
    }
}
