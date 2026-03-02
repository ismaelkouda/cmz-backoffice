import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface NodeItemDto {
    nodeMonitoringLink: string;
}

export type NodeResponseDto = SimpleResponseDto<NodeItemDto>;
