import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface UsersSelectItemApiDto {
    id: string;
    first_name: string;
    last_name: string;
}

export type UsersSelectResponseApiDto = SimpleResponseDto<
    UsersSelectItemApiDto[]
>;
