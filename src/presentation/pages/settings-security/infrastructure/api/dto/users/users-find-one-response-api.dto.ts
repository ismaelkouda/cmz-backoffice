import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface UsersFindOneItemApiDto {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    profile: {
        code: string;
        name: string;
    };
    responsibility: {
        code: string;
        name: string;
    };
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export type UsersFindOneResponseApiDto =
    SimpleResponseDto<UsersFindOneItemApiDto>;
