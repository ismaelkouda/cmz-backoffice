import { Paginate } from '../../../../../../shared/interfaces/paginate';

export interface notificationsCenterInterface {
    created_at: string;
    data: string | null;
    description: string;
    id: number;
    operation: string;
    read: boolean;
    reference: string;
    type: string;
    updated_at: string;
}

export interface notificationsCenterApiResponseInterface {
    error: boolean;
    message: string;
    data: Paginate<notificationsCenterInterface>;
}
