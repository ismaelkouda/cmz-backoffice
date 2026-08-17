import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface ServicesItemDto {
    useOfServersResourcesLink: string;
}

export type ServicesResponseDto = SimpleResponseDto<ServicesItemDto>;
