import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface ResourcesItemDto {
    useOfServersResourcesLink: string;
}

export type ResourcesResponseDto = SimpleResponseDto<ResourcesItemDto>;
