import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface NewsCategoriesSelectItemApiDto {
    id: number;
    name: string;
    sub_categories: NewsCategoriesSelectItemApiDto[];
}

export type NewsCategoriesSelectResponseApiDto = SimpleResponseDto<
    NewsCategoriesSelectItemApiDto[]
>;
