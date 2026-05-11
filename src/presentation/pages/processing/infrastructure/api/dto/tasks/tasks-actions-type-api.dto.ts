import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface TasksActionsTypeItemApiDto {
    code: string;
    name: string;
}

export type TasksActionsTypeResponseApiDto = SimpleResponseDto<
    TasksActionsTypeItemApiDto[]
>;
