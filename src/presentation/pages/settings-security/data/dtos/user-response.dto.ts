import { PaginatedResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface UserItemDto {
    id: string;
    matricule: string;
    lastName: string;
    firstName: string;
    fullName?: string;
    email: string;
    uniqId: string;
    profile: string;
    status: string;
    created_at: string;
    updated_at?: string;
}

export interface UserResponseDto extends PaginatedResponseDto<UserItemDto> { }
