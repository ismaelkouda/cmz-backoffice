import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { TelecomOperatorDto } from '@shared/data/dto/telecom-operator.dto';

export interface TasksActionsTypeItemApiDto {
    code: string;
    name: string;
    operators: TelecomOperatorDto[];
}

export type TasksActionsTypeResponseApiDto = SimpleResponseDto<
    TasksActionsTypeItemApiDto[]
>;
