import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

export interface MapClustersItemApiDto {
    lat: string;
    long: string;
    count: number;
}

export type MapClustersResponseApiDto =
    PaginatedResponseDto<MapClustersItemApiDto>;
