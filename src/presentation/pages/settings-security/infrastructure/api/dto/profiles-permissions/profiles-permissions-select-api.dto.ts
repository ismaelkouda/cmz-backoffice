import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface ProfilesPermissionsSelectItemApiDto {
    id: string;
    name: string;
    code: string;
}

export type ProfilesPermissionsSelectResponseApiDto = SimpleResponseDto<
    ProfilesPermissionsSelectItemApiDto[]
>;
