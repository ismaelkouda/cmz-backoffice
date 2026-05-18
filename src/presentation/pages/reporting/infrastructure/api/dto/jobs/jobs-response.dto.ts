import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface JobsItemDto {
    impactJobs: string;
}

export type JobsResponseDto = SimpleResponseDto<JobsItemDto>;
