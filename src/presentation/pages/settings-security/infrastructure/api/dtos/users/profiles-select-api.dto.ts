import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface ProfilesSelectItemApiDto {
    id: string;
    name: string;
    code: string;
}

export type ProfilesSelectResponseApiDto = SimpleResponseDto<
    ProfilesSelectItemApiDto[]
>;
