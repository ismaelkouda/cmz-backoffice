import { ActorDto } from '@shared/data/dto/actor.dto';
import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';
import { TelecomOperatorDto } from '@shared/data/dto/telecom-operator.dto';

export enum ReportStateDto {
    TERMINATED = 'terminated',
}

export interface TasksActionsItemApiDto {
    id: string;
    date: string;
    type: string;
    type_code: string;
    operator: TelecomOperatorDto;
    description: string;
    should_notify_user: boolean;
    status: boolean;
    created_by: ActorDto;
    updated_by: ActorDto;
    created_at: string;
    updated_at: string;
}

export type TasksActionsResponseApiDto =
    PaginatedResponseDto<TasksActionsItemApiDto>;
