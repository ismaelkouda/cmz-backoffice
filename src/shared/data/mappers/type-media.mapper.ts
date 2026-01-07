import { Injectable } from '@angular/core';
import { TypeMediaDto } from '@shared/data/dtos/type-media.dto';
import { TypeMedia } from '@shared/domain/enums/type-media.enum';

@Injectable({
    providedIn: 'root',
})
export class TypeMediaMapper {
    mapToEnum(dtoValue: TypeMediaDto): TypeMedia {
        if (dtoValue == null) {
            return TypeMedia.UNKNOWN;
        }
        const methodMap: Record<TypeMediaDto, TypeMedia> = {
            [TypeMediaDto.IMAGE]: TypeMedia.IMAGE,
            [TypeMediaDto.VIDEO]: TypeMedia.VIDEO,
            [TypeMediaDto.UNKNOWN]: TypeMedia.UNKNOWN,
        };
        return methodMap[dtoValue] || TypeMedia.UNKNOWN;
    }

    mapToDto(enumValue: TypeMedia): TypeMediaDto {
        if (enumValue == null) {
            return TypeMediaDto.UNKNOWN;
        }
        const mapping: Record<TypeMedia, TypeMediaDto> = {
            [TypeMedia.IMAGE]: TypeMediaDto.IMAGE,
            [TypeMedia.VIDEO]: TypeMediaDto.VIDEO,
            [TypeMedia.UNKNOWN]: TypeMediaDto.UNKNOWN,
        };
        return mapping[enumValue] || TypeMediaDto.UNKNOWN;
    }
}
