import { Paginate } from '@shared/interfaces/paginate';

export interface NewspapersItemDto {
    id: string;
    uniq_id: string;
    description: string;
    date: string;
    type: string;
    createdAt: string;
    updatedAt: string;
}

export interface NewspapersResponseDto {
    error: boolean;
    message: string;
    data: Paginate<NewspapersItemDto>;
}
