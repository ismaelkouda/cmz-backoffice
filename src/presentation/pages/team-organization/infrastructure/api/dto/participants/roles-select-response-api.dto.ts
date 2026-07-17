import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface RolesSelectItemApiDto {
    id: string;
    name: string;
    code: string;
}

export type RolesSelectResponseApiDto = SimpleResponseDto<
    RolesSelectItemApiDto[]
>;
