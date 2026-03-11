import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface UsersSelectItemApiDto {
    id: string;
    fullName: string;
}

export type UsersSelectResponseApiDto = SimpleResponseDto<
    UsersSelectItemApiDto[]
>;
