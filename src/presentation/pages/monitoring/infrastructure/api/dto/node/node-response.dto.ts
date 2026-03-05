import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface NodeItemDto {
    useOfServersResourcesLink: string;
}

export type NodeResponseDto = SimpleResponseDto<NodeItemDto>;
