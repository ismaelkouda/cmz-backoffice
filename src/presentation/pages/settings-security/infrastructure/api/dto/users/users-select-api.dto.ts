import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface UsersSelectItemApiDto {
    id: string;
    name: string;
    code: string;
}

export type UsersSelectResponseApiDto = SimpleResponseDto<
    UsersSelectItemApiDto[]
>;
