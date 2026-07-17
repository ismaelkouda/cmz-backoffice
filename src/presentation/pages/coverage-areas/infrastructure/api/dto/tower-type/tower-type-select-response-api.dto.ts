import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface TowerTypeSelectItemApiDto {
    id: string;
    name: string;
}

export type TowerTypeSelectResponseApiDto = SimpleResponseDto<
    TowerTypeSelectItemApiDto[]
>;
