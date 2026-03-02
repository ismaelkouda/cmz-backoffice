import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface NewsCategoriesSelectItemApiDto {
    id: string;
    name: string;
    code: string;
    departments: NewsCategoriesSelectItemApiDto[];
}

export type NewsCategoriesSelectResponseApiDto = SimpleResponseDto<
    NewsCategoriesSelectItemApiDto[]
>;
