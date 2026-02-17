import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

export enum ReportStateDto {
    TERMINATED = 'terminated',
}

export interface TasksActionsItemApiDto {
    uniq_id: string;
    date: string;
    type: string;
    description: string;
    should_notify_user: boolean;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
}

export type TasksActionsResponseApiDto =
    PaginatedResponseDto<TasksActionsItemApiDto>;
