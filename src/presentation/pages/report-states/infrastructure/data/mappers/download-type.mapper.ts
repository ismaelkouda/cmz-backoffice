import { Injectable } from '@angular/core';
import { DownloadTypeDto } from '../../api/dto/download-type-api.dto';
import { DownloadType } from '@presentation/pages/report-states/domain/enums/download-type.enum';

@Injectable({ providedIn: 'root' })
export class DownloadTypeMapper {
    mapFromDto(dto: DownloadTypeDto): DownloadType {
        const methodMap: Record<DownloadTypeDto, DownloadType> = {
            [DownloadTypeDto.EXCel]: DownloadType.EXCel,
            [DownloadTypeDto.SHAPE]: DownloadType.SHAPE,
        };
        return methodMap[dto];
    }
    mapToDto(value: DownloadType): DownloadTypeDto {
        const methodMap: Record<DownloadType, DownloadTypeDto> = {
            [DownloadType.EXCel]: DownloadTypeDto.EXCel,
            [DownloadType.SHAPE]: DownloadTypeDto.SHAPE,
        };
        return methodMap[value];
    }
}
