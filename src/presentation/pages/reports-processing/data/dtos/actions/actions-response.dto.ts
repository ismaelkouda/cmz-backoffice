import { PaginatedResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface ActionsItemDto {
    id: string;
    report_uniq_id: string;
    date: string;
    type: string;
    description: string;
    should_notify_user: boolean;
    created_by: {
        id: string;
        last_name: string;
        first_name: string;
        phone: string;
    };
    updated_by: {
        id: string;
        last_name: string;
        first_name: string;
        phone: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface ActionsResponseDto
    extends PaginatedResponseDto<ActionsItemDto> { }
