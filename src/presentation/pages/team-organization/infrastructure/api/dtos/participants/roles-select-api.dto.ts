import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface RolesSelectItemApiDto {
    id: string;
    name: string;
    code: string;
}

export type RolesSelectResponseApiDto = SimpleResponseDto<
    RolesSelectItemApiDto[]
>;
