import { Injectable } from '@angular/core';
import { PlatformDto } from '@shared/data/dto/platform.dto';
import { Platform } from '@shared/domain/enums/platform.enum';

@Injectable({
    providedIn: 'root',
})
export class PlatformMapper {
    mapFromDto(dto: PlatformDto): Platform {
        const methodMap: Record<PlatformDto, Platform> = {
            [PlatformDto.MOBILE]: Platform.MOBILE,
            [PlatformDto.WEB]: Platform.WEB,
            [PlatformDto.PWA]: Platform.PWA,
        };
        return methodMap[dto];
    }
    mapToDto(value: Platform): PlatformDto {
        const methodMap: Record<Platform, PlatformDto> = {
            [Platform.MOBILE]: PlatformDto.MOBILE,
            [Platform.WEB]: PlatformDto.WEB,
            [Platform.PWA]: PlatformDto.PWA,
        };
        return methodMap[value];
    }
}
