import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface ProfilesSelectItemApiDto {
    id: string;
    name: string;
    code: string;
}

export type ProfilesSelectResponseApiDto = SimpleResponseDto<
    ProfilesSelectItemApiDto[]
>;
