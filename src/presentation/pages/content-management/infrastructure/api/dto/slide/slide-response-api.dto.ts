import { ActionDropdownDto } from '@shared/data/dto/action-dropdown.dto';
import { RolesDto } from '@shared/data/dto/roles.dto';
import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

export interface SlideItemApiDto {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: RolesDto;
    status: ActionDropdownDto;
    created_at: string;
    updated_at: string;
}

export type SlideResponseApiDto = PaginatedResponseDto<SlideItemApiDto>;
