import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface ProfilesPermissionsSelectItemApiDto {
    uniq_id: string;
    name: string;
}

export type ProfilesPermissionsSelectResponseApiDto = SimpleResponseDto<
    ProfilesPermissionsSelectItemApiDto[]
>;
