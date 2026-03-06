import { Injectable } from '@angular/core';

import { TypeMediaDto } from '@shared/data/dto/type-media.dto';
import { TypeMedia } from '@shared/domain/enums/type-media.enum';

@Injectable({
    providedIn: 'root',
})
export class TypeMediaMapper {
    mapFromDto(dto: TypeMediaDto): TypeMedia {
        const methodMap: Record<TypeMediaDto, TypeMedia> = {
            [TypeMediaDto.IMAGE]: TypeMedia.IMAGE,
            [TypeMediaDto.VIDEO]: TypeMedia.VIDEO,
        };
        return methodMap[dto];
    }
    mapToDto(value: TypeMedia): TypeMediaDto {
        const methodMap: Record<TypeMedia, TypeMediaDto> = {
            [TypeMedia.IMAGE]: TypeMediaDto.IMAGE,
            [TypeMedia.VIDEO]: TypeMediaDto.VIDEO,
        };
        return methodMap[value];
    }
}
