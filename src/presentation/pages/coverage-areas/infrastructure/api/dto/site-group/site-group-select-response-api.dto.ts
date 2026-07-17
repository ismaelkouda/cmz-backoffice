import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface SiteGroupSelectItemApiDto {
    id: string;
    name: string;
    description: string;
}

export type SiteGroupSelectResponseApiDto = SimpleResponseDto<
    SiteGroupSelectItemApiDto[]
>;
