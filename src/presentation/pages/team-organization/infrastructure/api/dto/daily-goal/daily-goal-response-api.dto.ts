import { StatusDto } from '@pages/team-organization/infrastructure/api/dto/daily-goal/daily-goal-status-api.dto';
import { ActorDto } from '@shared/data/dto/actor.dto';
import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

export interface DailyGoalItemApiDto {
    id: string;
    user: ActorDto;
    task_target: string;
    tasks_completed: string;
    percentage: string;
    status: StatusDto;
    created_at: string;
}

export type DailyGoalResponseApiDto = PaginatedResponseDto<DailyGoalItemApiDto>;
