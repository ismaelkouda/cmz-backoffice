import { PriorityLevelDto } from '@shared/data/dtos/priority-level.dto';

export const PriorityLevel: Record<PriorityLevelDto, string> = {
    [PriorityLevelDto.LOW]: 'COMMON.LOW',
    [PriorityLevelDto.MEDIUM]: 'COMMON.MEDIUM',
    [PriorityLevelDto.HIGH]: 'COMMON.HIGH',
    [PriorityLevelDto.CRITICAL]: 'COMMON.CRITICAL',
};

export type PriorityLevelLabel = (typeof PriorityLevel)[PriorityLevelDto];
