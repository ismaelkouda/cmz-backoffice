import { ActorDto } from '@shared/data/dto/actor.dto';
import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

export enum ReportStateDto {
    TERMINATED = 'terminated',
}

export interface TasksActionsItemApiDto {
    id: string;
    date: string;
    type: string;
    description: string;
    should_notify_user: boolean;
    created_by: ActorDto;
    updated_by: ActorDto;
    created_at: string;
    updated_at: string;
}

export type TasksActionsResponseApiDto =
    PaginatedResponseDto<TasksActionsItemApiDto>;
