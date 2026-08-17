import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface ResourcesItemDto {
    useOfResourcesLink: string;
}

export type ResourcesResponseDto = SimpleResponseDto<ResourcesItemDto>;
