import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface MapItemDto {
    mapLink: string;
}

export type MapResponseDto = SimpleResponseDto<MapItemDto>;
